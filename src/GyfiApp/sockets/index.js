import parseUser from './middleware/parseUser'
import isAuth from './middleware/isAuth'
import getParams from './middleware/getParams'
import socketAsPromised from 'socket.io-as-promised'

export default (ctx) => {
  console.log('------------------------------***-----------')
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
  const { Message } = ctx.models;
  ctx.io.on('connection', async (socket) => {
    console.log('Step 1   connection')
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
            socket.emit(roomId, { message: message });
          });
          socket.emit('chat_' + userData.to, {messages: room, idRoom: roomId});
          socket.emit('chat_' + userData.from, {messages: room, idRoom: roomId});
        });
      }
    });

    // /** Create Room for Admin Chat */
    // socket.on('supportChat', (data) => {
    //   if (data.userId) {
    //     socket.emit('support', data);
    //     socket.emit('support_chat' + data.idUser, data);
    //   }
    // })
  })
};

