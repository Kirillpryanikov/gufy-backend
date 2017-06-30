/**
 * Created by smartit-11 on 29.06.17.
 */
export default(ctx) => {
  const { Device } = ctx.models
  // const { checkNotFound } = ctx.helpers
  // const { e400, e500 } = ctx.errors
  const controller = {}

  controller.get = async function(req) {
    const params = req.allParams()
    const devices = await Device.findAll({});
    return devices
  };

  return controller
}
