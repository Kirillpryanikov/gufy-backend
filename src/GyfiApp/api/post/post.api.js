import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './post.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { Post } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();

  api.post('/', controller.create)
  api = wrapper(ctx, { model: Post, api })

  return api
}
