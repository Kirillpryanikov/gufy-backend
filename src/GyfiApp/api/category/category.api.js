import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './category.controller'
import fileUpload from 'express-fileupload'

import wrapper from '../wrapper'
export default (ctx) => {
  const { Category } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();

  api.get('/:id/products', controller.products)

  api = wrapper(ctx, { model: Category, api })

  api.post('/create', fileUpload(), controller.create);

  return api
}
