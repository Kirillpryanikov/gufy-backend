import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const Device = sequelize.define('device', {
    deviceId: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
    },
  })
  ctx.models.Device = Device
  return Device
}
