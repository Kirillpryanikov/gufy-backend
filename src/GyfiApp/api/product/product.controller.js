let jwt = require('jsonwebtoken');
import _ from 'lodash';
import { socketConnected } from '../../sockets';

export default(ctx) => {
  const controller = {}
  const { _checkNotFound, checkNotFound, isAuth } = ctx.helpers
  const { Product, User, Values } = ctx.models
  const { e400 } = ctx.errors

  controller.get = async function(req) {
    const params = req.query;
    const limit = 20;
    let query = {
      where: {
        vipTime: {
          $gte: new Date(),
        },
      },
    };

    if (req.query.page) {
      query.offset = parseInt(params.page) * limit;
      query.limit = limit;
    }
    const products = await Product.findAll(query);
    return products
  }

  controller.getPurchasedProducts = async function (req) {
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);
    return await Product.findAll({
      where: {
        buyerId: userObj.id,
      },
    })
  };

  controller.getOld = async function(req) {
    const products = await Product.findAll({
      where: {
        vipTime: {
          $lt: new Date(),
        },
      },
    })
    return products
  }

  controller.getProductsOther = async function(req) {
    const products = await Product.findAll({
      where: {
        vipTime: {
          $eq: null,
        },
      },
    })
    return products
  }

  controller.create = async function(req) {
    isAuth(req)
    const params = req.allParams()
    params.ownerId = req.user.id
    const owner = await User.findById(params.ownerId).then(_checkNotFound('User'))

    if ((+params.vipTime) > 0) {
      const token = req.headers['x-access-token'];
      const userObj = jwt.verify(token, ctx.config.jwt.secret);

      let user = await User.findById(userObj.id);
      const price = await Values.find({
        where: {
          name: 'vip-time',
        },
      });
      const costGyfi = +price.value * +params.vipTime;
      if (user.gyfi < costGyfi) {
        throw e400('У вас недостаточно валюты');
      }
      if (params.vipTime && parseFloat(params.vipTime) > 0) {
        const currentDate = new Date();
        params.vipTime = new Date(currentDate.setHours(currentDate.getHours() + +params.vipTime + 24));
        user.gyfi = user.gyfi - costGyfi;
        await user.save();
      }
    } else {
      params.vipTime = new Date(Date.now() + 86400000);
    }

    const product = await Product.create(params)
    try {
      await owner.updateProductsCount()
      await owner.save()
    } catch (err) {
      console.error(err)
    }
    return product
  }

  controller.update = async function(req) {
    isAuth(req);

    const params = req.allParams();
    const { id } = params;

    _.omit(params, ['ownerId', 'buyerId']);

    let product = await Product.findById(id);

    if (typeof params.vipTime !== 'string' && parseFloat(params.vipTime) > 0) {
      const token = req.headers['x-access-token'];
      const userObj = jwt.verify(token, ctx.config.jwt.secret);

      let user = await User.findById(userObj.id);
      const price = await Values.find({
        where: {
          name: 'vip-time',
        },
      });

      const costGyfi = parseFloat(price.value) * parseFloat(params.vipTime);

      if (user.gyfi < costGyfi) {
        throw e400('У вас недостаточно валюты');
      }

      if (params.vipTime) {
        params.vipTime = new Date(product.vipTime.setHours(product.vipTime.getHours() + +params.vipTime))
        user.gyfi = user.gyfi - costGyfi;
        await user.save();
      }
    } else if (typeof params.vipTime !== 'string') {
      delete params.vipTime;
    }

    await Product.update(params, {
      where: {
        id,
      },
    });
    return Product.findById(id);
  };

  controller.buy = async function(req) {
    isAuth(req);
    const params = req.allParams();
    const { id } = params;
    const userObj = jwt.verify(req.headers['x-access-token'], ctx.config.jwt.secret);
    const buyer = await User.findById(userObj.id).then(checkNotFound);
    const product = await Product.findById(id).then(checkNotFound);
    if (buyer.gyfi < product.price) {
      throw e400('У вас недостаточно валюты')
    }
    if (product.status !== 'REVIEW') {
      throw e400('Продукт уже кем то куплен')
    }
    const roomId = userObj.id + product.ownerId;
    const socket = socketConnected();
    socket.emit('chat_' + product.ownerId, {messages: 'Ваш товар ' + product.title + ' куплен', idRoom: roomId});
    socket.emit('chat_' + userObj.id, {messages: 'Владелец товара о покупке ' + product.title + ' оповещен', idRoom: roomId});

    product.buyerId = buyer.id;
    product.status = 'INPROCESS';
    buyer.gyfi -= product.price;
    buyer.buysCount += 1;
    await product.save();
    await buyer.save();

    return product
  };

  /**
   * When owner Sent product
   * @param req
   */
  controller.sentProduct = async (req) => {
    isAuth(req);
    const { id } = req.allParams();
    /** Check user **/
    const userObj = jwt.verify(req.headers['x-access-token'], ctx.config.jwt.secret);
    const product = await Product.findById(id).then(checkNotFound);
    /** Owner Check status product to SENT */
    if (product.ownerId == userObj.id && product.status === 'INPROCESS') {
      product.status = 'SENT';
      await product.save();
      const socket = socketConnected();
      const roomId = userObj.id + product.buyerId;
      socket.emit('chat_' + product.buyerId, {messages: 'Товар ' + product.title + ' отправлен', idRoom: roomId});
      socket.emit('chat_' + userObj.id, {messages: 'Товар ' + product.title + ' отправлен', idRoom: roomId});
      return product;
    } else {
      throw e400('Товар не удалось отправить');
    }
  };
  /**
   * Owner check status product
   * @param req
  */
  controller.deliveredProduct = async (req) => {
    isAuth(req);
    const { id } = req.allParams();
    /** Check user **/
    const userObj = jwt.verify(req.headers['x-access-token'], ctx.config.jwt.secret);
    const product = await Product.findById(id).then(checkNotFound);
    /** Owner Check status product to DELIVERED */
    if (product.ownerId == userObj.id && product.status === 'SENT') {
      product.status = 'DELIVERED';
      await product.save();
      return product;
    } else {
      throw e400('Товар не был доставлен');
    }
  };
  /**
   * Apply product buy
   * @param req
   * @returns {Promise.<boolean>}
   */
  controller.apply = async (req) => {
    isAuth(req);
    const { id } = req.allParams();
    /** Check user **/
    const userObj = jwt.verify(req.headers['x-access-token'], ctx.config.jwt.secret);
    /** Get product **/
    const product = await Product.findById(id).then(checkNotFound);
    const owner = await User.findById(product.ownerId).then(checkNotFound);

    if (userObj.id == product.buyerId && product.status === 'DELIVERED' && product.buyerId !== product.ownerId) {
      /** Change price **/
      owner.gyfi += product.price;
      owner.save();
      product.status = 'BOUGHT';
      await product.save();
      const socket = socketConnected();
      const roomId = userObj.id + product.buyerId;
      socket.emit('chat_' + product.ownerId, {messages: 'Товар ' + product.title + ' получен', idRoom: roomId});
      socket.emit('chat_' + userObj.id, {messages: 'Товар ' + product.title + ' получен', idRoom: roomId});
    } else {
      throw e400('Не удалось купить товар');
    }
    return product;
  };

  /**
   * Decline product buy
   * @param req
   * @returns {Promise.<void>}
   */
  controller.decline = async (req) => {
    isAuth(req);
    const { id } = req.allParams();
    /** Get product **/
    const product = await Product.findById(id).then(checkNotFound);
    const buyer = await User.findById(product.buyerId).then(checkNotFound);
    /** Return money to buyer **/
    buyer.gyfi += product.price;
    buyer.save();
    product.status = 'REVIEW';
    product.save();
    return product;
  };
  /**
   * Get Sold products
   * @param req
   */
  controller.getSoldProducts = async (req) => {
    isAuth(req);
    const userObj = jwt.verify(req.headers['x-access-token'], ctx.config.jwt.secret);
    return await Product.findAll({
      where: {
        ownerId: userObj.id,
        status: 'BOUGHT',
      },
    });
  };

  controller.extendVipTime = async function (req) {
    const params = req.allParams();
    const { id, hours } = params;

    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);

    const price = await Values.find({
      where: {
        name: 'vip-time',
      },
    });
    const user = await User.findById(userObj.id).then(checkNotFound);
    const costGyfi = price.value * hours;

    if (user.gyfi < costGyfi) {
      throw e400('У вас недостаточно валюты')
    }
    const product = await Product.findById(id)
    user.gyfi -= costGyfi;
    product.vipTime = await new Date(product.vipTime).setHours(product.vipTime.getHours() + +hours);

    user.save();
    product.save();

    return product;
  };

  controller.getProductByName = async function (req) {
    isAuth(req);
    const params = req.allParams();
    const { name, viptime } = params;

    let query = {
      where: {
        title: {
          $like: `%${name}%`,
        },
      },
    };

    if (viptime === 'true') {
      query = {
        where: {
          title: {
            $like: `%${name}%`,
          },
          vipTime: {
            $gte: new Date(),
          },
        },
      }
    }
    return await Product.findAll(query)
  };


  return controller
}
