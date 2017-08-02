import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './values.controller'
import wrapper from '../wrapper'

export default (ctx) => {
  const { wrapResourse, createResourse } = ctx.helpers
  const { Values } = ctx.models;
  const controller = getController(ctx)
  let api = asyncRouter();

  api.get('/', controller.getValues);
  api.put('/:id', controller.updateValue);
  api.get('/cost/viptime', controller.getCostVipTime)

  api = wrapper(ctx, { model: Values, api })

  return api
}
