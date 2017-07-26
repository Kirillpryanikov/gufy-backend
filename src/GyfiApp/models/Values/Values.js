import Sequelize from 'sequelize'

export default function createModel(ctx) {
  const sequelize = ctx.sequelize

  const Values = sequelize.define('values', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    value: {
      type: Sequelize.STRING,
      required: true,
    },
    description: {
      type: Sequelize.STRING,
    },
  })
  ctx.models.Values = Values
  return Values;
}
