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
      if (socket.request.headers['x-access-token']) {
        const userConnection = jwt.verify(socket.request.headers['x-access-token'], ctx.config.jwt.secret);
        sockets.push({socket, userId: userConnection.id});
      } else {
        sockets.push({socket, userId: ''});
      }

      socket.on('sendMessage', (userData) => {
        /** Find chat if exist **/
        if (userData.to !== userData.from) {
          _.forEach(sockets, item => {
            if (item.socket.id === socket.id && item.userId === '') {
              item.userId = userData.from;
            }
          });
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
        const rem = _.remove(sockets, item => {
          if (item.userId) {
            return item.socket.id === socket.id
          }
        })[0];

        if (!rem) {
          return;
        }
        if (rem.userId) {
          const params = {
            userId: rem.userId,
            timeDisconect: Date.now(),
          };

          const userTime = await TimeDisconnectUser.find({
            where: { userId: rem.userId },
          });
          if (userTime) {
            TimeDisconnectUser.update(params, {
              where: {
                userId: rem.userId,
              },
            });
          } else {
            TimeDisconnectUser.create(params);
          }
        }
      });
    });
  },
};
