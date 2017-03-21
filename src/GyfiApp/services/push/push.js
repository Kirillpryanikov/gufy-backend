import FCM from 'fcm-push'
export default (ctx) => {
  const service = {}
  service.serverKey = ctx.config.fcm.serverKey
  service.fcm = new FCM(this.config.fcm.serverKey)
  service.pushSend = async function (devices = [], data) {
    const promises = devices.map(device => {
      const message = {
        to: device.token,
        notification: {
          title: data.title || 'Title of your push notification',
          body: data.title || 'Body of your push notification',
          badge: data.notificationsCount || 0,
        },
        priority: 'high',
        content_available: true,
        data,
      }
      return this.fcm.send(message)
      .then(response => {
        console.log('push res', response);
      })
      .catch(err => {
        console.log('push err', err);
      })
    })
    return Promise.all(promises)
  }
  return service
}
