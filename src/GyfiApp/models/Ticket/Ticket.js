import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const Ticket = sequelize.define('ticket', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    actionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
  })
  ctx.models.Ticket = Ticket
  return Ticket
}
