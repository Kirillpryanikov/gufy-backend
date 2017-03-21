import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './socialNetwork.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { SocialNetwork } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();

  api = wrapper(ctx, { model: SocialNetwork, api })

  return api
}
