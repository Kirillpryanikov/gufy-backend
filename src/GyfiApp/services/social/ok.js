export default (ctx) => {
  const service = {}
  service.checkByToken = async function checkByToken(uid, accessToken) {
    return new Promise(function (resolve) {
      console.log({
        uid, accessToken,
      })
      if (!uid || !accessToken) {
        return resolve(false)
      }
      try {
        ctx.passport._strategies.odnoklassniki.userProfile(accessToken, (err, body) => {
          if (body && body.id && body.id === uid) {
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
