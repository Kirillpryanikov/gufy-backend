import fetch from 'node-fetch'
export default (ctx) => {
  // const { clientID, clientSecret } = ctx.config.social.vk
  const service = {}
  service.checkByToken = async function checkByToken(uid, accessToken) {
    return new Promise(function (resolve) {
      if (!uid || !accessToken) {
        return resolve(false)
      }
      try {
        return fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}`)
        .then((response) => {
          response.json().then((json) => {
            if (json && json.response && json.response[0] && json.response[0].uid && json.response[0].uid.toString() === uid.toString()) {
              return resolve(true)
            }
            return resolve(false)
          })
        })
        // ctx.passport._strategies.vkontakte.userProfile(accessToken, (err, profile) => {
        //   console.log({ err, profile })
        //   if (profile && profile.id && profile.id.toString() === uid.toString()) {
        //     return resolve(true)
        //   }
        //   return resolve(false)
        // })
      } catch (err) {
        return resolve(false)
      }
    })
  }
  return service
}
