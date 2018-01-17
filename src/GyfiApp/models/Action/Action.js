import Sequelize from 'sequelize'
import validator from 'validator'
import _ from 'lodash';
import { socketConnected } from '../../sockets';
import * as admin from 'firebase-admin';

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
    images: sequelize.jsonField(sequelize, 'action', 'images'),
    finishedAt: {
      type: Sequelize.DATE,
      defaultValue: null,
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
      required: true,
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
        // const config = {
        //   apiKey: "AIzaSyAPH0M518_QX2dX_-QzH7FlZl_FAFh_IUo",
        //   authDomain: "gyfifirebase.firebaseapp.com",
        //   databaseURL: "https://gyfifirebase.firebaseio.com",
        //   projectId: "gyfifirebase",
        //   storageBucket: "gyfifirebase.appspot.com",
        //   messagingSenderId: "1030469364175"
        // };
        // admin.initializeApp(config);

        const socket = socketConnected();

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
          socket.emit('notification_' + this.winnerId, { messages: 'Вы выиграли в акции ' + this.get('title') + '.'});
          /**
           * Firebase send notification
           */
          // admin.messaging().sendToDeviceGroup('notification_' + this.winnerId,
          //   {messages: 'Вы выиграли в акции ' + this.get('title') + '.' })
          //   .then(function(response) {})
          //   .catch(function(error) {});
          return this.save()
        }
        if (this.get('fixedWinnerId')) {
          this.winnerId = this.get('fixedWinnerId')
        } else {
          const winner = _.shuffle(tickets)[0]
          this.winnerId = winner.id
        }
        const winner = await User.findById(this.winnerId);
        if (winner && winner.updateActionWinsCount) {
          setTimeout(() => {
            return winner.updateActionWinsCount()
          }, 3000)
        }
        this.status = 'COMPLETE';
        socket.emit('notification_' + this.winnerId, { messages: 'Вы выиграли в акции ' + this.get('title') + '.'});
        /**
         * Firebase send notification
         */
        // admin.messaging().sendToDeviceGroup('notification_' + this.winnerId,
        //   {messages: 'Вы выиграли в акции ' + this.get('title') + '.' })
        //   .then(function(response){})
        //   .catch(function(error){});

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
        action.images = this.get('images')
        action.images = transformationStringIntoArray(action.images);
        if (action.images) {
          action.images = this.get('images')
        } else {
          action.images = []
        }
        if (Array.isArray(action.images)) {
          action.images = action.images.map(image => {
            image = image.replace(new RegExp('"', 'g'), '');
            if (image) {
              if (image.startsWith(ctx.config.url) === false) {
                image = `${ctx.config.url}/${image}`;
              }
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
      action.images = ['http://wmz-pwnz.ru/sites/default/files/no_avatar.jpg']
    }
    action.images = JSON.stringify(action.images);
  })
  Action.hook('beforeCreate', function (action) {
    if (!action.vipTime) {
      const nextDay = new Date(Date.now() + 86400000);
      action.vipTime =  new Date(Date.UTC(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate() , nextDay.getHours(), nextDay.getMinutes()))
    }
  })
  Action.hook('beforeUpdate', function (action) {
    action.runCompleteTimeout()
  })
  Action.hook('afterSave', function (action) {
    action.runCompleteTimeout()
  })
  Action.hook('afterCreate', function (action) {
    action.runCompleteTimeout()
    action.updateUserActionsCount()
    ctx.models.User.findById(action.get('ownerId'))
      .then(user => {
        if (user && user.updateActionsCount) {
          return user.updateActionsCount()
        }
      })
  })
  Action.hook('afterDestroy', function (action) {
    action.runCompleteTimeout()
    action.updateUserActionsCount()
    ctx.models.User.findById(action.get('ownerId'))
      .then(user => {
        if (user && user.updateActionsCount) {
          return user.updateActionsCount()
        }
      })
  })
  Action.beforeDestroy(function (action) {
    return action.stopCompleteTimeout()
  })
  ctx.models.Action = Action
  return Action
}

function transformationStringIntoArray(array) {
  array = array.replace(/\[|\]/g, '');
  array = array.replace(/"/g, '');
  array = array.replace(/\\/g, '');
  array = array.split(',');
  return array;
}
