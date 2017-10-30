import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './action.controller'
import wrapper from '../wrapper'
export default (ctx) => {
  const { Action } = ctx.models;
  const controller = getController(ctx);
  let api = asyncRouter();

  api.get('/', controller.get);
  api.get('/old', controller.getOld);
  api.get('/other', controller.getProductsOther);
  api.get('/search', controller.getActionByName);
  api.get('/:id/users', controller.users);
  api.get('/:id/tickets', controller.tickets);
  api.get('/participate', controller.getActionParticipate);

  api.post('/', controller.create);
  api.post('/:id/join', controller.join);
  api.post('/:id/complete', controller.complete);
  api.put('/:id/extend-time', controller.extendVipTime);
  api.put('/:id', controller.update);


  api = wrapper(ctx, { model: Action, api });

  return api
}
