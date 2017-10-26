/**
 * Created by smartit-11 on 25.10.17.
 */

import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize;
  const TimeDisconnectUser = sequelize.define('time-disconnect-user', {
    userId: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
    },
    timeDisconect: {
      type: Sequelize.DATE,
      required: true,
      allowNull: false,
    },
  });
  ctx.models.TimeDisconnectUser = TimeDisconnectUser;
  return TimeDisconnectUser
}
