import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const Post = sequelize.define('post', {
    message: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    wallId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
  }, {
    instanceMethods: {
      async getUser() {
        const { User } = ctx.models
        return User.findById(this.get('userId'))
      },
    },
  })
  ctx.models.Post = Post
  return Post
}
