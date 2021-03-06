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
      default: 0,
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
    isGyfi: {
      type: Sequelize.BOOLEAN,
      required: true,
      default: true,
    },
    prizeGyfi: {
      type: Sequelize.INTEGER,
      required: true,
      default: 0,
    },
    isWinningPrize: {
      type: Sequelize.BOOLEAN,
      required: true,
      default: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  });

  ScratchGamePrize.hook('beforeCreate', function (prize) {
    if (prize.image) {
      prize.image = `${ctx.config.url}/${prize.image}`;
    }
  });

  ctx.models.ScratchGamePrize = ScratchGamePrize;
  return ScratchGamePrize
}
