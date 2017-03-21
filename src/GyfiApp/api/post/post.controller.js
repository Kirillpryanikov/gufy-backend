export default(ctx) => {
  const { User } = ctx.models
  const { _checkNotFound, isAuth } = ctx.helpers
  const { e400 } = ctx.errors
  const controller = {}

  controller.create = async function(req) {
    isAuth(req)
    const myUserId = req.user.id
    const params = req.allParams()
    const { userId, message } = params
    if (!userId) {
      throw e400('!userId')
    }
    if (!message) {
      throw e400('!message')
    }
    const user = await User.findById(userId)
    .then(_checkNotFound('User'))
    return user.writePost(message, myUserId)
  }

  return controller
}
