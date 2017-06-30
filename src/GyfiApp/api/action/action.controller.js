export default(ctx) => {
  const { User, Action, Ticket } = ctx.models
  const { checkNotFound, isAuth, _checkNotFound } = ctx.helpers
  const { e400 } = ctx.errors
  const controller = {}

  controller.get = async function(req) {
    const actions = await Action.findAll({
      where: {
        vipTime: {
          $gte: new Date(),
        },
      },
    })
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
    const params = req.allParams()
    const owner = await User.findById(req.user.id)
    params.ownerId = owner.id
    const action = await Action.create(params)
    if (params.fixedWinnerId) {
      await Ticket.create({ userId: params.fixedWinnerId, actionId: action.id, price: params.price})
    }
    return action
  }
  controller.join = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const { id } = params
    const actionId = id
    const userId = req.user.id
    const user = await User.findById(userId).then(checkNotFound)
    const action = await Action.findById(actionId).then(checkNotFound)

    if (user.gyfi < action.price) {
      throw e400('У вас недостаточно валюты')
    }
    const ticket = await Ticket.create({ userId, actionId, price: action.price })
    user.gyfi -= action.price
    await ticket.save()
    await user.save()
    return { action, ticket }
  }

  controller.users = async function(req) {
    const params = req.allParams()
    const id = params.id
    const action = await Action.findById(id)
    .then(_checkNotFound('Action'))
    const tickets = await Ticket.findAll({ categoryId: id })
    const userIds = []

    tickets.forEach((ticket) => {
      if (userIds.indexOf(ticket.userId) === -1) {
        userIds.push(ticket.userId)
      }
    })
    if (userIds.length === 0) {
      userIds.push(action.ownerId)
    }
    return userIds
  }

  controller.tickets = async function(req) {
    const params = req.allParams()
    const id = params.id
    const action = await Action.findById(id)
    const tickets = await action.getTickets()
    return tickets
  }

  controller.complete = async function(req) {
    const params = req.allParams()
    const { id } = params
    const action = await Action.findById(id)
    return action.complete()
  }

  return controller
}
