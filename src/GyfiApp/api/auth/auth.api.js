import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import getController from './auth.controller'
export default function (ctx) {
  const api = asyncRouter()
  const controller = getController(ctx)
  api.all('/signup', controller.signup)
  api.all('/login', controller.login)
  api.all('/validate', controller.validate)
  return api
}
