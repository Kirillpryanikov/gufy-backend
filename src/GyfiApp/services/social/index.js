import getVkService from './vk'
import getFbService from './fb'
import getOkService from './ok'
export default (ctx) => {
  const vkService = getVkService(ctx)
  const fbService = getFbService(ctx)
  const okService = getOkService(ctx)
  const service = {}
  service.checkByToken = function checkByToken(socialNetworkType, ... params) {
    if (socialNetworkType === 'fb') {
      return fbService.checkByToken(... params)
    }
    if (socialNetworkType === 'vk') {
      return vkService.checkByToken(... params)
    }
    if (socialNetworkType === 'ok') {
      return okService.checkByToken(... params)
    }
    return false
  }
  return service
}
