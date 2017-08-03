import Sequelize from 'sequelize'

export default function createModel(ctx) {
  const sequelize = ctx.sequelize

  const FreeGyfi = sequelize.define('free gyfi', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    date: {
      type: Sequelize.INTEGER,
      required: true,
      default: Date.now(),
    },
    count: {
      type: Sequelize.INTEGER,
    },
    isVideoClip: {
      type: Sequelize.BOOLEAN,
      required: true,
      default: false,
    },
  })
  ctx.models.FreeGyfi = FreeGyfi;
  return FreeGyfi;
}
