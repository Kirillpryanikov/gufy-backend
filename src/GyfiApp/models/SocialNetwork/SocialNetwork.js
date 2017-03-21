import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const SocialNetwork = sequelize.define('socialNetwork', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    type: {
      type: Sequelize.ENUM,
      values: ['fb', 'vk', 'ok'],
      required: true,
      allowNull: false,
    },
    networkId: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
  })
  ctx.models.SocialNetwork = SocialNetwork
  return SocialNetwork
}
