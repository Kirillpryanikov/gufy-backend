import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize;
  const Support = sequelize.define('support', {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    isRead: {
      type: Sequelize.BOOLEAN,
      required: true,
      default: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    phoneNumbers: sequelize.jsonField(sequelize, 'support', 'phoneNumbers'),
    data: {
      type: Sequelize.DATE,
      required: true,
      default: Date.now(),
    },
  }, {
    instanceMethods: {
      toJSON() {
        const support = this.dataValues;
        if (support.phoneNumbers) {
          support.phoneNumbers = this.get('phoneNumbers');
          if (IsJsonString(support.phoneNumbers)) {
            support.phoneNumbers = JSON.parse(support.phoneNumbers)
          }
        } else {
          support.phoneNumbers = []
        }
        return support
      },
    },
  });
  ctx.models.Support = Support;
  return Support
}

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
