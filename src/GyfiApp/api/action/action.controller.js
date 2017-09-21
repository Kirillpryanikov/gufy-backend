
var jwt = require('jsonwebtoken');
const moment = require('moment');

export default(ctx) => {
  const { User, Action, Ticket, Values } = ctx.models
  const { checkNotFound, isAuth, _checkNotFound } = ctx.helpers
  const { e400 } = ctx.errors
  const controller = {}

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
    const actions = await Action.findAll(query);
    return actions
  }

  controller.getOld = async function(req) {
    const actions = await Action.findAll({
      where: {
        vipTime: {
          $lt: new Date(),
        },
      },
    })
    return actions
  }

  controller.getProductsOther = async function(req) {
    const actions = await Action.findAll({
      where: {
        vipTime: {
          $eq: null,
        },
      },
    })
    return actions
  }

  controller.create = async function(req) {
    isAuth(req)
    const params = req.allParams();
    const owner = await User.findById(req.user.id);
    params.ownerId = owner.id;

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
    const action = await Action.create(params);
    return action
  }

  controller.join = async function(req) {
    isAuth(req);
    const params = req.allParams();
    const { id } = params;
    const actionId = id;
    const userId = req.user.id;
    const user = await User.findById(userId).then(checkNotFound);
    const action = await Action.findById(actionId).then(checkNotFound);

    if (user.gyfi < action.price) {
      throw e400('У вас недостаточно валюты')
    }
    const ticket = await Ticket.create({ userId, actionId, price: action.price });
    user.gyfi -= action.price;
    await ticket.save();
    await user.save();
    return { action, ticket }
  }

  controller.users = async function(req) {
    const params = req.allParams()
    const id = params.id
    // const action = await Action.findById(id)
    // .then(_checkNotFound('Action'))
    const tickets = await Ticket.findAll({ where: {actionId: id} })
    const userIds = []
    console.log('Size array -> ', tickets.length);
    tickets.forEach((ticket) => {
      if (userIds.indexOf(ticket.userId) === -1) {
        userIds.push(ticket.userId)
      }
    })
    // if (userIds.length === 0) {
    //   userIds.push(action.ownerId)
    // }
    return userIds
  }

  controller.tickets = async function(req) {
    const params = req.allParams();
    const id = params.id;
    const action = await Action.findById(id);
    const tickets = await action.getTickets()
    return tickets
  }

  controller.complete = async function(req) {
    const params = req.allParams();
    const { id } = params;
    const action = await Action.findById(id);
    return action.complete()
  };

  controller.extendVipTime = async function (req) {
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);
    const params = req.allParams()
    const { id, hours } = params;
    const price = await Values.find({
      where: {
        name: 'vip-time',
      },
    });
    const user = await User.findById(userObj.id).then(checkNotFound);
    const costGyfi = parseFloat(price.value) * hours;

    if (user.gyfi < costGyfi) {
      throw e400('У вас недостаточно валюты')
    }
    const action = await Action.findById(id);
    user.gyfi -= costGyfi;
    action.vipTime = await new Date(action.vipTime).setHours(action.vipTime.getHours() + +hours);

    user.save();
    action.save();

    return action;
  };

  controller.update = async function(req) {
    isAuth(req);
    const params = req.allParams();
    const { id } = params;
    let action = await Action.findById(id);

    if (parseFloat(params.vipTime) > 0) {
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

      if (params.vipTime && parseFloat(params.vipTime) > 0) {
        params.vipTime = new Date(action.vipTime.setHours(action.vipTime.getHours() + +params.vipTime));
        user.gyfi = user.gyfi - costGyfi;
        await user.save();
      }
    } else {
      delete params.vipTime;
    }

    await Action.update(params, {
      where: {
        id,
      },
    });
    return Action.findById(id);
  };

  controller.getActionByName = async function (req) {
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
    return await Action.findAll(query)
  };

  return controller
}
