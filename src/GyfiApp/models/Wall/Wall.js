import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize

  const Wall = sequelize.define('wall', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      required: true,
    },
  }, {
    instanceMethods: {
      async getPosts() {
        const { Post } = ctx.models
        return Post.findAll({
          where: {
            wallId: this.get('id'),
          },
        });
      },
      async getUser() {
        const { User } = ctx.models
        return User.findById(this.userId)
      },
      async getPostsWithUsers() {
        const posts = await this.getPosts()
        const promises = posts.map(async post => {
          const user = await post.getUser()
          post.user = user
          return post
        })
        return Promise.all(promises)
      },
    },
  })
  ctx.models.Wall = Wall
  return Wall
}
