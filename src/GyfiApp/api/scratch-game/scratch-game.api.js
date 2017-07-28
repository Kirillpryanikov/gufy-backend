import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './scratch-game.controller'
import wrapper from '../wrapper'

export default (ctx) => {
  const { wrapResourse, createResourse } = ctx.helpers
  const { ScratchGamePrize } = ctx.models;
  const controller = getController(ctx)
  let api = asyncRouter();

  api.get('/', controller.getPrizes);
  api.post('/', controller.create);
  api.get('/prize', controller.getRandomPrize);

  api = wrapper(ctx, { model: ScratchGamePrize, api })

  return api
}
