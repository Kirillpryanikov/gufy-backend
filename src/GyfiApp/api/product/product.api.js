import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './product.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  // const { wrapResourse, createResourse } = ctx.helpers
  const { Product } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();
  api.get('/', controller.get)
  api.get('/old', controller.getOld)
  api.get('/other', controller.getProductsOther)
  api.get('/search', controller.getProductByName)

  api.post('/', controller.create)
  api.put('/:id', controller.update)
  api.post('/:id/buy', controller.buy)
  api.put('/:id/extend-time', controller.extendVipTime)

  api = wrapper(ctx, { model: Product, api })

  return api
}
