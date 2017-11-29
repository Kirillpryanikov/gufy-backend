export default(ctx) => {
  const { Product, Category } = ctx.models;
  const { checkNotFound, isAuth } = ctx.helpers;
  const { e400, e500 } = ctx.errors
  const controller = {}

  controller.products = async function(req) {
    const params = req.allParams();
    const categoryId = params.id;
    const limit = 20;
    let query = {
      where: {
        categoryId: categoryId,
      }
    };
    if (req.query.page) {
      query.offset = parseInt(params.page) * limit;
      query.limit = limit;
    }
    const products = await Product.findAll(query);
    return products
  };

  controller.create = async function (req) {
    isAuth(req);
    const params = req.allParams();

    let data = {
      title: params.title,
      image: '',
    };
    if (req.files && req.files.image) {
      const { image } = req.files;
      const filename = await ctx.helpers.saveFile(`${new Date().getTime()}`, image);
      data.image = `${ctx.config.protocol}://${ctx.config.host}/${filename}`;
    }
    return await Category.create(data);
  };

  controller.update = async function (req) {
    isAuth(req);
    let category;
    const params = req.allParams();
    let data = {
      image: '',
    };
    if (params.id) {
      category = await Category.findById(params.id);
      if (req.files && req.files.image) {
        const { image } = req.files;
        const filename = await ctx.helpers.saveFile(`${new Date().getTime()}`, image);
        data.image = `${ctx.config.protocol}://${ctx.config.host}/${filename}`;
      }
      category.image = data.image;
      return await category.save();
    } else {
      throw e400('Не найдена категория');
    }
  };

  return controller
}
