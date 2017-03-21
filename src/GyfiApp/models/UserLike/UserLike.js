import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const UserLike = sequelize.define('like', {
    fromUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    toUserId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      required: true,
    },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  })
  ctx.models.UserLike = UserLike
  return UserLike
}
