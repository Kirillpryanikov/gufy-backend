import Sequelize from 'sequelize'

export default function createModel(ctx) {
  const sequelize = ctx.sequelize;

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
      values: ['REVIEW', 'BOUGHT', 'ACCEPTED', 'DECLINED', 'SENT', 'DELIVERED', 'INPROCESS'],
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
        product.images = strToArray(product.images);
        if (product.images) {
          product.images = this.get('images')
        } else {
          product.images = []
        }
        if (Array.isArray(product.images)) {
          product.images = product.images.map(image => {
            image = image.replace(new RegExp('"', 'g'), '');
            if (image) {
              if (image.startsWith(ctx.config.url) === false) {
                image = `${ctx.config.url}/${image}`;
              }
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

  Product.hook('beforeCreate', function (product) {
    if (!product.vipTime) {
      const nextDay = new Date(Date.now() + 86400000);
      product.vipTime =  new Date(Date.UTC(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), nextDay.getHours(), nextDay.getMinutes()))
      // const currentDate = new Date();
      // product.vipTime = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  })

  Product.hook('afterCreate', function (product) {
    ctx.models.Category.findById(product.get('categoryId'))
    .then(category => {
      if (category && category.updateProductsCount) {
        return category.updateProductsCount()
      }
    });
    ctx.models.User.findById(product.get('ownerId'))
      .then(user => {
        if (user && user.updateProductsCount) {
          return user.updateProductsCount()
        }
      })
  })

  Product.hook('afterDestroy', function (product) {
    ctx.models.Category.findById(product.get('categoryId'))
    .then(category => {
      if (category && category.updateProductsCount) {
        return category.updateProductsCount()
      }
    });
    ctx.models.User.findById(product.get('ownerId'))
      .then(user => {
        if (user && user.updateProductsCount) {
          return user.updateProductsCount()
        }
      })
  })

  ctx.models.Product = Product
  return Product
}

function strToArray(array) {
  array = array.replace(/\[|\]/g, '');
  array = array.replace(/"/g, '');
  array = array.replace(/\\/g, '');
  array = array.split(',');
  return array;
}
