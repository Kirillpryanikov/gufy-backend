import Sequelize from 'sequelize'
import validator from 'validator'
import _ from 'lodash'
export default function createModel(ctx) {
  const sequelize = ctx.sequelize
  const Action = sequelize.define('action', {
    title: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
    },
    winnerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      required: false,
    },
    fixedWinnerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      required: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: false,
      defaultValue: 1,
    },
    //This method create json not valid
    // images: sequelize.jsonField(sequelize, 'action', 'images'),
    images: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    finishedAt: {
      type: Sequelize.DATE,
      required: true,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['REVIEW', 'COMPLETE', 'ACCEPTED', 'DECLINED'],
      defaultValue: 'REVIEW',
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    vipTime: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
    vip: {
      type: Sequelize.VIRTUAL,
      get() {
        const vipTime = this.get('vipTime')
        if (!vipTime) {
          return false
        }
        try {
          return new Date(vipTime) >= new Date()
        } catch (err) {
          return false
        }
      },
    },
  }, {
    instanceMethods: {
      async complete() {
        const { User } = ctx.models
        const tickets = await this.getTickets()
        if (tickets.length === 0) {
          this.winnerId = this.get('ownerId')
          this.status = 'COMPLETE'
          const winner = await User.findById(this.winnerId)
          if (winner && winner.updateActionWinsCount) {
            setTimeout(() => {
              return winner.updateActionWinsCount()
            }, 3000)
          }
          return this.save()
        }
        if (this.get('fixedWinnerId')) {
          this.winnerId = this.get('fixedWinnerId')
        } else {
          const winner = _.shuffle(tickets)[0]
          this.winnerId = winner.id
        }
        const winner = await User.findById(this.winnerId)
        if (winner && winner.updateActionWinsCount) {
          setTimeout(() => {
            return winner.updateActionWinsCount()
          }, 3000)
        }
        this.status = 'COMPLETE'
        return this.save()
      },
      async getTickets() {
        const { Ticket } = ctx.models
        return Ticket.findAll({
          where: {
            actionId: this.get('id'),
          },
        })
      },
      stopCompleteTimeout() {
        return ctx.Schedule.cancel(`action_${this.id}_finish`)
      },
      runCompleteTimeout() {
        if (this.winnerId) {
          return this
        }
        const currentDate = new Date()
        const finishedAt = new Date(this.finishedAt)
        this.stopCompleteTimeout()
        if (finishedAt > currentDate) {
          ctx.Schedule.add(`action_${this.id}_finish`, finishedAt, () => {
            this.complete()
          })
        }
      },
      async updateUserActionsCount() {
        const { User } = ctx.models
        const user = await User.findById(this.get('ownerId'))
        if (user && user.updateActionsCount) {
          return user.updateActionsCount()
        }
        return null
      },
      toJSON() {
        const action = this.dataValues;
        if (action.images && validator.isJSON(action.images)) {
          action.images = this.get('images')
        }
        // else {
        //   action.images = [];
        // }
        if (Array.isArray(action.images)) {
          action.images = action.images.map(image => {
            if (image && image[0] === '/') {
              image = ctx.config.url + image
            }
            return image
          })
        }
        return action;
      },
    },
  })
  Action.hook('beforeValidate', function (action) {
    if (typeof action.dataValues.images === 'string') {
      action.images = [action.dataValues.images]
    }
    if (!Array.isArray(action.images)) {
      action.images = []
    }
    action.images = action.images
  })
  Action.hook('beforeUpdate', function (action) {
    console.log('afterUpdate')
    action.runCompleteTimeout()
  })
  Action.hook('afterSave', function (action) {
    action.runCompleteTimeout()
  })
  Action.hook('afterCreate', function (action) {
    action.runCompleteTimeout()
    action.updateUserActionsCount()
  })
  Action.beforeDestroy(function (action) {
    return action.stopCompleteTimeout()
  })
  ctx.models.Action = Action
  return Action
}
