/**
 * Created by smartit-11 on 29.06.17.
 */
import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './device.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  // const { wrapResourse, createResourse } = ctx.helpers
  const { Device } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();
  api.get('/', controller.get)
  api = wrapper(ctx, { model: Device, api })


  return api
}
