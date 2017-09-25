import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './support.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { Support } = ctx.models;
  const controller = getController(ctx);
  let api = asyncRouter();

  api.get('/', controller.getUnreadMessage);
  api.get('/read/:id', controller.readMessage);
  api.get('/:id/messages', controller.getMessagesByIdUser);

  api.post('/', controller.sendMessage);

  api = wrapper(ctx, { model: Support, api });

  return api
}
