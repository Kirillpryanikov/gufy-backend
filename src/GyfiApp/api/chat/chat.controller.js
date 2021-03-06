const jwt = require('jsonwebtoken');
const _ = require('lodash');

export default (ctx) => {
  const { User, Message, TimeDisconnectUser } = ctx.models;
  const { checkNotFound, isAuth } = ctx.helpers;
  const { e400 } = ctx.errors;
  const controller = {};

  controller.getMessages = async function (req) {
    isAuth(req);
    const params = req.allParams();
    const { id } = params;
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);

    return await Message.findAll({
      where: {
        fromUserId: {$or: [userObj.id, id]},
        toUserId: {$or: [userObj.id, id]},
      },
      raw: true,
    })
  };

  controller.getCharts = async function (req) {
    isAuth(req);
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);
    let idUsers = [];

    const users = await Message.findAll({
      where: {
        $or: [{fromUserId: userObj.id}, {toUserId: userObj.id}],
      },
    });

    let result = [];
    _.forEach(users, user => {
      if (user['fromUserId'] != userObj.id) {
        idUsers.push(user['fromUserId']);
      }
      if (user['toUserId'] != userObj.id) {
        idUsers.push(user['toUserId']);
      }
    });

    idUsers = _.uniq(idUsers);
    console.log('idUsers ', idUsers);
    _.forEach(idUsers, (item) => {
      let data = [];
      _.forEach(users, u => {
        if (u.fromUserId === item || u.toUserId === item) {
          data.push(u);
        }
      });
      console.log('******************************** ', data.length);
      // {message: result[index], unread: unread.length}
      result.push({
        unread: 0,
        message: _.maxBy(data, d => d.createdAt),
      });
    });
    console.log('result ', result.unread);
    /**
     * Get count unread messages
     * @type {number}
     */
    await Promise.all(_.map(idUsers, async(res, index) => {
      const userTimeVisit = await TimeDisconnectUser.find({
        where: {
          userId : userObj.id,
        },
      });
      if (userTimeVisit) {
        const unread = await Message.findAll({
          where: {
            toUserId: userTimeVisit.userId,
            fromUserId: res,
            createdAt: { $gte: userTimeVisit.timeDisconect },
          },
        });
        result[index].unread = unread.length;
      } else {
        result[index].unread = 0;
      }
    }));

    return result;
  };

  controller.getNotReadable = (idUser, ownerId) => {
    const userTimeVisit = TimeDisconnectUser.find({
      where: {
        userId : ownerId,
      },
    });
    if (userTimeVisit) {
      const allMessages = Message.findAll({
        where: {
          toUserId: userTimeVisit.userId,
          fromUserId: idUser,
          createdAt: { $gte: userTimeVisit.timeDisconect },
        },
      });
      return allMessages.length;
    } else {
      return 0;
    }
  };
  return controller;
}
