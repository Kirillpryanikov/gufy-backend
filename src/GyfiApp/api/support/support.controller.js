let jwt = require('jsonwebtoken');

export default (ctx) => {
  const { Support, User } = ctx.models;
  const { isAuth, _checkNotFound } = ctx.helpers;

  let controller = {};

  controller.sendMessage = async function (req) {
    isAuth(req);
    const params = req.allParams();
    if (params.message) {
      const userObj = jwt.verify(req.headers['x-access-token'], ctx.config.jwt.secret);
      const user = await User.findById(userObj.id);
      const data = {
        text: params.message,
        userId: userObj.id,
        email: user.email,
        firstName: userObj.firstName,
        phoneNumbers: user.phoneNumbers,
        data: Date.now(),
        isRead: false,
      };
      const support = await Support.create(data);
      return support;
    }
  };

  controller.getUnreadMessage = async function (req) {
    isAuth(req);
    const messages = await Support.findAll({
      where: {
        isRead: false,
      },
    });
    return messages;
  };

  controller.readMessage = async function (req) {
    isAuth(req);
    const params = req.allParams();
    const message = await Support.findById(params.id);
    message.isRead = true;
    message.save();
    return message;
  };

  return controller
}

