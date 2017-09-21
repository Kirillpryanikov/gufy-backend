import asyncRouter from 'lego-starter-kit/utils/AsyncRouter';
import getController from './chat.controller';
import wrapper from '../wrapper';


export default (ctx) => {
  const { Message } = ctx.models;

  let api = asyncRouter();
  api.get('/:id/chat', getController(ctx));

  api = wrapper(ctx, { model: Message, api });

  return api;
}
