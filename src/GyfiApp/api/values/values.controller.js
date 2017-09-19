export default(ctx) => {
  const { Values } = ctx.models
  const { checkNotFound } = ctx.helpers;
  const { e400, e500 } = ctx.errors;

  const controller = {}

  controller.getValues = async (req) => {
    const values = await Values.findAll({});
    return values;
  };

  controller.updateValue = async (req) => {
    const params = req.allParams();
    const { id } = params
    await Values.update(params, {
      where: {
        id,
      },
    })
    return Values.findById(id)
  };

  controller.getCostVipTime = async (req) => {
    return await Values.find({
      where: {
        name: 'vip-time',
      },
    })
  }

  controller.getCostScratchGame = async (req) => {
    return await Values.find({
      where: {
        name: 'scratch-cost-game',
      },
    });
  };

  controller.getCountFreeGyfi = async (req) => {
    return await Values.find({
      where: {
        name: 'free-gyfi',
      },
    })
  };

  return controller
}
