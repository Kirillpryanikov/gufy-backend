import parseUser from './middleware/parseUser'
import isAuth from './middleware/isAuth'
import getParams from './middleware/getParams'
import socketAsPromised from 'socket.io-as-promised';
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let socketC;
let sockets = [];

module.exports = {
  socketConnected: () => socketC,
  getSockets: async (ctx) => {
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
    const { Message, User, Support, TimeDisconnectUser } = ctx.models;

    ctx.io.on('connection', async (socket) => {
      socketC = socket;
      const userConnection = jwt.verify(socket.request.headers['x-access-token'], ctx.config.jwt.secret);

      //Add to array sockets
      sockets.push({socket, userId: userConnection.id});

      socket.on('sendMessage', (userData) => {
        /** Find chat if exist **/
        if (userData.to !== userData.from) {
          Message.create({
            fromUserId: userData.from,
            toUserId: userData.to,
            text: userData.text,
            files: userData.files || null,
          }).then(res => {
            sockets.forEach(item => {
              item.socket.emit(`chat_${userData.to}`, { message: res });
              item.socket.emit(`chat_${userData.from}`, { message: res });
            })
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
      });

      socket.on('disconnect', async (res) => {
        const userObj = jwt.verify(socket.request.headers['x-access-token'], ctx.config.jwt.secret);

        if (userObj) {
          const params = {
            userId: userObj.id,
            timeDisconect: Date.now(),
          };

          const userTime = await TimeDisconnectUser.find({
            where: { userId: userObj.id },
          });
          if (userTime) {
            TimeDisconnectUser.update(params, {
              where: {
                userId: userObj.id,
              },
            });
          } else {
            TimeDisconnectUser.create(params);
          }
          _.remove(sockets, item => item.userId === userObj.id);
        }
      });
    });
  },
};


