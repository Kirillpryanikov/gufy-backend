import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './user.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { User } = ctx.models
  const controller = getController(ctx)
  let api = asyncRouter();
  api.post('/', controller.create)
  api.get('/me', controller.getMe)
  api.delete('/:id', controller.removeUser);
  // Устройства юзера
  api.post('/device', controller.addDevice)
  api.delete('/device', controller.removeDevice)
  api.get('/device', controller.getDevices)
  // Логика
  api.get('/:id/referals', controller.getReferals)
  api.get('/:id/wall', controller.getWall)
  api.get('/:id/products', controller.products)
  api.get('/:id/actions', controller.actions)
  api.get('/:id/tickets', controller.tickets)
  // api.delete('/:id', controller.delete)
  // Лайки
  api.get('/:id/like', controller.getLikesAndDislikes)
  api.post('/:id/like', controller.setLike)
  api.delete('/:id/like', controller.removeLike)
  api.post('/:id/dislike', controller.setDislike)
  api.delete('/:id/dislike', controller.removeDislike)
  // Соц сети
  api.post('/social', controller.addSocialNetwork)
  api.delete('/social', controller.removeSocialNetwork)

  // Free gyfi
  api.get('/freegyfi', controller.getFreeGyfiOnceInDay);
  api.get('/banner', controller.getFreeGyfiBanner);

  api = wrapper(ctx, { model: User, api, ignore: ['post'] })
  return api
}
