export default(ctx) => {
  const { Product, Category } = ctx.models
  // const { checkNotFound } = ctx.helpers
  // const { e400, e500 } = ctx.errors
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

  return controller
}
