export default (ctx) => {
  const service = {}
  service.checkByToken = async function checkByToken(uid, accessToken) {
    return new Promise(function (resolve) {
      if (!uid || !accessToken) {
        return resolve(false)
      }
      try {
        ctx.passport._strategies.facebook.userProfile(accessToken, (err, profile) => {
          if (profile && profile.id && profile.id.toString() === uid.toString()) {
            return resolve(true)
          }
          return resolve(false)
        })
      } catch (err) {
        return resolve(false)
      }
    })
  }
  return service
}
