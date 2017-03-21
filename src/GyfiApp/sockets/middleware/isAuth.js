export default (ctx) => {
  return function (socket, next) {
    if (socket.user && socket.user.id) {
      return next()
    }
    return null
  }
}
