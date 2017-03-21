import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './wall.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { Wall } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();

  api = wrapper(ctx, { model: Wall, api, ignore: ['delete', 'put'] })

  return api
}
