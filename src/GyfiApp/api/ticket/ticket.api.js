import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './ticket.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { Ticket } = ctx.models
  const controller = getController(ctx);
  let api = asyncRouter();

  api = wrapper(ctx, { model: Ticket, api })
  api.post('/buy', controller.create);

  return api
}
