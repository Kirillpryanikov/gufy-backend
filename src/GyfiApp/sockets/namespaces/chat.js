export default (ctx, io) => {
  const namespace = io.of('chat');
  namespace.use(io.middlewares.getParams);
  namespace.use(io.middlewares.parseUser);
  namespace.use(io.middlewares.isAuth);
  namespace.use(io.middlewares.socketAsPromised);

  namespace.on('connection', async socket => {
    console.log('Chat connection!');

    const { Message } = ctx.models
    socket.join(`user_${socket.user.id}`)
    socket.on('message', async function (params) {
      if (!params.text || !params.to) {
        return null
      }
      const message = await Message.create({
        fromUserId: socket.user.id,
        toUserId: params.to,
        text: params.text,
        files: params.files || null,
      });
      namespace.to(`user_${params.to}`).emit('message', message);
      return message
    });
    // socket.on('getStory', () => Promise.resolve('returned a promise'));
    socket.on('getStory', async (params) => {
      const userId = socket.user.id;
      const opponentId = params.userId;
      // return Promise.resolve('returned a promise')
      return Message.findAll({
        where: {
          $or: [
            {
              fromUserId: userId,
              toUserId: opponentId,
            },
            {
              fromUserId: opponentId,
              toUserId: userId,
            },
          ],
        },
      })
    })
  });
  return io
}
