import _ from 'lodash'
export default(ctx) => {
  const controller = {}
  const { _checkNotFound, checkNotFound, isAuth } = ctx.helpers
  const { Product, User } = ctx.models
  const { e400 } = ctx.errors

  controller.get = async function(req) {
    const products = await Product.findAll({
      where: {
        vipTime: {
          $gte: new Date(),
        },
      },
    })
    return products
  }

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

  controller.create = async function(req) {
    isAuth(req)
    const params = req.allParams()
    params.ownerId = req.user.id
    const owner = await User.findById(params.ownerId).then(_checkNotFound('User'))
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
    const params = req.allParams()
    const { id } = params
    _.omit(params, ['ownerId', 'buyerId'])
    console.log({ params })
    await Product.update(params, {
      where: {
        id,
      },
    })
    return Product.findById(id)
  }

  controller.buy = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const { id } = params
    const userId = req.user.id
    const buyer = await User.findById(userId).then(checkNotFound)
    const product = await Product.findById(id).then(checkNotFound)
    if (buyer.gyfi < product.price) {
      throw e400('У вас недостаточно валюты')
    }
    if (product.status === 'BOUGHT') {
      throw e400('Продукт уже кем то куплен')
    }
    const owner = await User.findById(product.ownerId).then(checkNotFound)
    product.buyerId = buyer.id
    product.status = 'BOUGHT'
    buyer.gyfi -= product.price
    owner.gyfi += product.price
    buyer.buysCount += 1
    await product.save()
    await buyer.save()

    return product
  }
  return controller
}
