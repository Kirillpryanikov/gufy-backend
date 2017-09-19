import parseUser from './middleware/parseUser'
import isAuth from './middleware/isAuth'
import getParams from './middleware/getParams'
import addChatNamespace from './namespaces/chat'
import socketAsPromised from 'socket.io-as-promised'

export default (ctx) => {
  const io = ctx.io;
  io.middlewares = {
    getParams: getParams(ctx),
    parseUser: parseUser(ctx),
    isAuth: isAuth(ctx),
    socketAsPromised: socketAsPromised(),
  };
  io.use(io.middlewares.parseUser);
  io.use(io.middlewares.socketAsPromised);
  addChatNamespace(ctx, io);

  // ctx.io.on('connection', async (socket) => {
  //   let room = {};
  //   console.log('CONNECTION');
  //   socket.emit('enter', {message: 'Hello'});
  //
  //   socket.on('startChat', function (data) {
  //     // data : to, from?
  //     let data2 = {
  //       from: 'user1',
  //       to: 'user2',
  //     };
  //     let chat = 'chat';
  //     console.log('Wait to chat = ', data);
  //
  //
  //     if (data2.from && data2.to && data2.from !== data2.to) {
  //       // Message to
  //       socket.on(data2.to + chat, function (message) {
  //         // Save to DB
  //         socket.emit(data2.from + chat, { data: 'HEllo' });
  //       });
  //
  //       // Message from
  //       socket.on(data2.from + chat, function (message) {
  //         socket.emit(data2.to + chat, { data: 'HEllo2' });
  //       });
  //     }
  //
  //   //   in "data" three fields -> fromUserId, toUserId
  //   //
  //   //   get history by roomId
  //   //   make a listener for room
  //   //
  //   //   socket.on('invite' + data.toUserId, () => {
  //   //
  //   //     console.log(`Invite to room "${data.toUserId}"`);
  //   //     socket.emit(`chat${data.toUserId}`, {message: 'Hello'});
  //   //
  //   //     socket.on(`chat${data.toUserId}`, (data) => {
  //   //
  //   //     });
  //   //   });
  //   //
  //   //
  //   //   room = data.room;
  //   //
  //   //   if (room) {
  //   //     socket.on(room, function (message) {
  //   //       console.log('message', message);
  //   //       socket.emit(room, message);
  //   //     });
  //   //   }
  //   //
  //   //   // send notification to user
  //   //   socket.emit('global', { room: data.room, to: data.user });
  //   });
  //   socket.emit('startChat', {message: 'Hello'});
  // });
}
