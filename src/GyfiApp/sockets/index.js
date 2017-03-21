import parseUser from './middleware/parseUser'
import isAuth from './middleware/isAuth'
import getParams from './middleware/getParams'
import addChatNamespace from './namespaces/chat'
import socketAsPromised from 'socket.io-as-promised'
export default (ctx) => {
  const io = ctx.io
  io.middlewares = {
    getParams: getParams(ctx),
    parseUser: parseUser(ctx),
    isAuth: isAuth(ctx),
    socketAsPromised: socketAsPromised(),
  }
  io.use(io.middlewares.parseUser)
  io.use(io.middlewares.socketAsPromised)
  addChatNamespace(ctx, io)
  // ctx.io.on('connection', async (socket) => {
  //   // console.log(socket)
  // })
  return io
}
