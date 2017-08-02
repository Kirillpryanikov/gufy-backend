import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './scratch-game.controller'
import wrapper from '../wrapper'

export default (ctx) => {
  const { wrapResourse, createResourse } = ctx.helpers
  const { ScratchGamePrize } = ctx.models;
  const controller = getController(ctx)
  let api = asyncRouter();

  api.get('/prizes', controller.getPrizes);
  api.get('/history', controller.getHistoryGame)
  api.get('/game', controller.getRandomPrizes);

  api.post('/', controller.create);

  api.put('/prize/:id', controller.updatePrize);
  api.put('/history/:id', controller.updateHistory);

  api.delete('/prize/:id', controller.deletePrize);
  api.delete('/history/:id', controller.deleteHistory);

  api = wrapper(ctx, { model: ScratchGamePrize, api })

  return api
}
