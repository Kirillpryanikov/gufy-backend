export default () => {
  return function (socket, next) {
    const { query } = socket.handshake
    const req = socket.request
    if (!req.query) {
      req.query = {}
    }
    socket.params = {}
    Object.assign(socket.params, query, req.query)
    return next()
  }
}
