import Sequelize from 'sequelize'
import validator from 'validator'

export default function createModel(ctx) {
  const sequelize = ctx.sequelize

  const Product = sequelize.define('product', {
    title: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      required: true,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
      // references: {
      //   model: 'users',
      //   key: 'id',
      // },
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
      // references: {
      //   model: 'categories',
      //   key: 'id',
      // },
    },
    buyerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'users',
      //   key: 'id',
      // },
    },
    status: {
      type: Sequelize.ENUM,
      values: ['REVIEW', 'BOUGHT', 'ACCEPTED', 'DECLINED'],
      defaultValue: 'REVIEW',
      allowNull: false,
    },
    images: sequelize.jsonField(sequelize, 'product', 'images'),
    description: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    vipTime: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
    vip: {
      type: Sequelize.VIRTUAL,
      get() {
        const vipTime = this.get('vipTime')
        if (!vipTime) {
          return false
        }
        try {
          return new Date(vipTime) >= new Date()
        } catch (err) {
          return false
        }
      },
    },
  }, {
    instanceMethods: {
      toJSON() {
        const product = this.dataValues
        product.vip = this.get('vip')
        product.images = this.get('images')
        if (product.images && validator.isJSON(product.images)) {
          product.images = this.get('images')
        } else {
          product.images = []
        }
        if (Array.isArray(product.images)) {
          product.images = product.images.map(image => {
            image = image.replace(new RegExp('"', 'g'), '');
            if (image) {
              image = `${ctx.config.url}/storage/${image}`;
            }
            return image
          })
        }
        return product
      },
    },
  })

  Product.hook('beforeValidate', function (product) {
    if (typeof product.dataValues.images === 'string') {
      product.images = [product.dataValues.images]
    }
    if (!Array.isArray(product.images)) {
      product.images = ['http://wmz-pwnz.ru/sites/default/files/no_avatar.jpg']
    }
    product.images = JSON.stringify(product.images);
  })

  Product.hook('afterCreate', function (product) {
    ctx.models.Category.findById(product.get('categoryId'))
    .then(category => {
      if (category && category.updateProductsCount) {
        return category.updateProductsCount()
      }
    })
  })

  Product.hook('afterDestroy', function (product) {
    ctx.models.Category.findById(product.get('categoryId'))
    .then(category => {
      if (category && category.updateProductsCount) {
        return category.updateProductsCount()
      }
    })
  })

  ctx.models.Product = Product
  return Product
}
