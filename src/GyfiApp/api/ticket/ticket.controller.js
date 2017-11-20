import _ from 'lodash';
let jwt = require('jsonwebtoken');

export default(ctx) => {
  const { User, Action, Ticket } = ctx.models
  const { _checkNotFound, checkNotFound, isAuth } = ctx.helpers
  const { e400, e500 } = ctx.errors;

  const controller = {};

  controller.create =  async function(req) {
    isAuth(req);
    const params = req.allParams();
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);
    if (params.actionId) {
      const countTicket = params.count || 1;
      const user = await User.findById(userObj.id).then(_checkNotFound('User'));
      const action = await Action.findById(params.actionId);

      const costTickets = countTicket * action.price;

      if (user.gyfi < costTickets) {
        throw e400('У вас недостаточно валюты');

      } else {
        let tickets = [];
        for(let i = 0; i < countTicket; i++){
          let data = {
            userId: userObj.id,
            actionId: params.actionId,
            price: action.price,
          };
          let newTicket = await Ticket.create(data);
          tickets.push(newTicket);
        }

        user.gyfi -= costTickets;
        await user.save();
        return tickets;
      }
    }
  };

  return controller
}
