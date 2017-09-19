import Sequelize from 'sequelize'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const Message = sequelize.define('message', {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    files: sequelize.jsonField(sequelize, 'message', 'files'),
    fromUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    toUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    roomId: Sequelize.STRING
  }, {
    instanceMethods: {
      toJSON() {
        const message = this.dataValues
        message.files = this.get('files')
        if (Array.isArray(message.files)) {
          message.files = message.files.map(file => {
            file.url = `${ctx.config.url}/${file.url}`
            return file
          })
        }
        return message
      },
    },
  })
  Message.beforeCreate(function (message) {
    if (!Array.isArray(message.files)) {
      message.files = null
    }
    if (Array.isArray(message.files)) {
      message.files = message.files.filter(file => {
        return file.type && file.name && file.url
      })
      if (message.files.length === 0) {
        message.files = null
      }
    }
  })
  ctx.models.Message = Message
  return Message
}
