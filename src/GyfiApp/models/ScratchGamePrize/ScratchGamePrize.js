import Sequelize from 'sequelize'

export default function createModel(ctx) {
  const sequelize = ctx.sequelize

  const ScratchGamePrize = sequelize.define('scratch-game-prize', {
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      required: true,
      default: `${ctx.config.url}/default-prize`,
    },
    weightVictory: {
      type: Sequelize.INTEGER,
      required: true,
    },
    inStoke: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    countPrize: {
      type: Sequelize.INTEGER,
      default: 0,
    },
    isAvaible: {
      type: Sequelize.BOOLEAN,
    },
  })

  ctx.models.ScratchGamePrize = ScratchGamePrize
  return ScratchGamePrize
}
