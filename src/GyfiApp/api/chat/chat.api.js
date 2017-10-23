import asyncRouter from 'lego-starter-kit/utils/AsyncRouter';
import getController from './chat.controller';
import wrapper from '../wrapper';

export default (ctx) => {
  const { Message } = ctx.models;
  const controller = getController(ctx);
  let api = asyncRouter();
  api.get('/:id/messages', controller.getMessages);
  api.get('/', controller.getCharts);

  api = wrapper(ctx, { model: Message, api });

  return api;
}
