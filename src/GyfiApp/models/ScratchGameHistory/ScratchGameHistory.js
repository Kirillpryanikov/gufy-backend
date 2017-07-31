/**
 * Created by smartit-11 on 28.07.17.
 */

import Sequelize from 'sequelize'

export default function createModel(ctx) {
  const sequelize = ctx.sequelize

  const ScratchGameHistory = sequelize.define('scratch-game-history', {
    userId: {
      type: Sequelize.INTEGER,
      references:'users',
      referencesKey: 'id',
      required: true,
      allowNull: false,
    },
    prizeId: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
    },
    dateGame: {
      type: Sequelize.DATE,
      required: true,
      default: new Date(),
    },
    percentWin: {
      type: Sequelize.INTEGER,
      default: 100,
    },
  })

  ctx.models.ScratchGameHistory = ScratchGameHistory
  return ScratchGameHistory
}
