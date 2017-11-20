import Sequelize from 'sequelize'
import getProduct from '../Product'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  // const json = sequelize.JsonField
  const Category = sequelize.define('category', {
    title: {
      type: Sequelize.STRING,
      unique: true,
      required: true,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      unique: false,
      defaultValue: null,
    },
    productsCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: false,
      defaultValue: 0,
    },
  }, {
    instanceMethods: {
      toJSON() {
        const category = this.dataValues
        const image = this.get('image')
        if (image) {
          // category.image = `${ctx.config.protocol}://${ctx.config.host}/${image}`
          const path = `${ctx.config.protocol}://${ctx.config.host}`;
          if (!category.image.startsWith(path)) {
            category.image = `${ctx.config.protocol}://${ctx.config.host}/${image}`
          }
        }
        return category
      },
      async updateProductsCount() {
        const { Product } = ctx.models
        const count = await Product.count({
          where: {
            categoryId: this.get('id'),
          },
        })
        this.productsCount = count;
        return this.save()
      },
    }
  })
  ctx.models.Category = Category
  return Category
}
