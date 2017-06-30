import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './action.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { wrapResourse, createResourse } = ctx.helpers
  const { Action } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();

  api.get('/', controller.get)
  api.get('/old', controller.getOld)
  api.get('/other', controller.getProductsOther)
  api.post('/', controller.create)
  api.get('/:id/users', controller.users)
  api.get('/:id/tickets', controller.tickets)
  api.post('/:id/join', controller.join)
  api.post('/:id/complete', controller.complete)

  api = wrapper(ctx, { model: Action, api })

  return api
}
