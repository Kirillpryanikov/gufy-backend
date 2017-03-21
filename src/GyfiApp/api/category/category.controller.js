export default(ctx) => {
  const { Product, Category } = ctx.models
  // const { checkNotFound } = ctx.helpers
  // const { e400, e500 } = ctx.errors
  const controller = {}

  controller.products = async function(req) {
    const params = req.allParams()
    const categoryId = params.id
    const products = await Product.findAll({ categoryId, order: '"allocated" DESC' })
    return products
  }

  return controller
}
