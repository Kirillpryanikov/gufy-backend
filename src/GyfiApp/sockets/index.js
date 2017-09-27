import parseUser from './middleware/parseUser'
import isAuth from './middleware/isAuth'
import getParams from './middleware/getParams'
import socketAsPromised from 'socket.io-as-promised';

let socketC;
module.exports = {
  socketConnected: () => socketC,
  getSockets: (ctx) => {
    const io = ctx.io;
    io.middlewares = {
      getParams: getParams(ctx),
      parseUser: parseUser(ctx),
      isAuth: isAuth(ctx),
      socketAsPromised: socketAsPromised(),
    };
    io.use(io.middlewares.parseUser);
    io.use(io.middlewares.socketAsPromised);
    /** Database connect **/
    const { Message, User, Support } = ctx.models;
    ctx.io.on('connection', async (socket) => {
      socketC = socket;
      socket.on('startChat', (userData) => {
        /** Find chat if exist **/
        if (userData.to !== userData.from) {
          Message.findAll({
            where: {
              fromUserId: {$or: [userData.to, userData.from]},
              toUserId: {$or: [userData.to, userData.from]},
            },
            raw: true,
          }).then(room => {
            if (room === undefined) {
              room = {};
            }
            /**  Create Room **/
            const roomId = userData.to + userData.from;
            socket.on(roomId, function (params) {
              const message = Message.create({
                fromUserId: params.from,
                toUserId: params.to,
                text: params.text,
                files: params.files || null,
              });
              socket.emit(roomId, {message: message});
            });
            socket.emit('chat_' + userData.to, {messages: room, idRoom: roomId});
            socket.emit('chat_' + userData.from, {messages: room, idRoom: roomId});
          });
        }
      });

      /** Create Room for Admin Chat */
      socket.on('supportChat', async (data) => {
        if (data.userId) {
          const user = await User.findById(data.userId);
          if (user) {
            const params = {
              text: data.message,
              userId: data.userId,
              email: user.email,
              firstName: user.firstName,
              phoneNumbers: user.phoneNumbers,
              avatar: user.avatar,
              data: Date.now(),
              isRead: false,
            };
            await Support.create(params);
            socket.emit('support', params);
          }
        }
      })
    })
  },
};


