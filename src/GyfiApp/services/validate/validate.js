export default (ctx) => {
  const service = {}
  const { User } = ctx.models
  service.checkUsernameIsAvaible = async (username) => {
    const user = await User.findOne({
      where: {
        username,
      },
    })
    if (user) {
      return false
    }
    return true
  }
  return service
}
