import _ from 'lodash'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import Sequelize from 'sequelize'

import getSocialService from '../../services/social'
//

export default function createModel(ctx) {
  if (ctx.models.User) {
    return ctx.models.User
  }
  const { e400, e500 } = ctx.errors
  const sequelize = ctx.sequelize

  const transporter = (ctx.config.mail && ctx.config.mail.transport) &&
  Promise.promisifyAll(nodemailer.createTransport(ctx.config.mail.transport))
  const socialService = getSocialService(ctx)
  const User = sequelize.define('user', {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user',
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      values: ['user', 'company'],
      defaultValue: 'user',
      allowNull: false,
    },
    gender: {
      type: Sequelize.ENUM,
      values: ['male', 'female'],
      defaultValue: 'male',
    },
    avatar: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'ACTIVE',
    },
    gyfi: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    banned: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    phoneNumbers: sequelize.jsonField(sequelize, 'user', 'phoneNumbers'),
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referal: {
      type: Sequelize.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'users',
      //   key: 'id',
      // },
    },
    bdate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    productsCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      required: false,
      allowNull: false,
    },
    age: {
      type: Sequelize.VIRTUAL,
      get() {
        const bdate = this.get('bdate')
        if (!bdate) {
          return 0
        }
        return this.calculateAge(bdate)
      },
    },
    fullname: {
      type: Sequelize.VIRTUAL,
      get() {
        let name = ''
        const firstName = this.get('firstName')
        const lastName = this.get('lastName')
        if (firstName) {
          name += firstName
        }
        if (lastName) {
          if (name.length > 0) {
            name += ' '
          }
          name += lastName
        }
        return name
      },
    },
    likes: {
      type: Sequelize.INTEGER,
      required: false,
      defaultValue: 0,
      allowNull: false,
    },
    dislikes: {
      type: Sequelize.INTEGER,
      required: false,
      defaultValue: 0,
      allowNull: false,
    },
    actionsCount: {
      type: Sequelize.INTEGER,
      required: false,
      defaultValue: 0,
      allowNull: false,
    },
    buysCount: {
      type: Sequelize.INTEGER,
      required: false,
      defaultValue: 0,
      allowNull: false,
    },
    actionWinsCount: {
      type: Sequelize.INTEGER,
      required: false,
      defaultValue: 0,
      allowNull: false,
    },
    network: {
      type: Sequelize.ENUM,
      values: ['vk', 'fb', 'ok'],
      allowNull: false,
      required: true,
    },
    // promo_code: {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   defaultValue: Sequelize.UUIDV4,
    // },
    // password: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   required: true,
    // },
    // data: sequelize.JsonField(sequelize, 'User', 'data'),
  }, {
    // МЕТОДЫ
    classMethods: {
      // generatePassword(length = 10) {
      //   return Math.random().toString(36).substr(2, length)
      // },
      async register(socialNetworkId, socialNetworkType, token, params) {
        const { SocialNetwork } = ctx.models
        const _socialNetwork = await SocialNetwork.findOne({
          networkId: socialNetworkId,
          type: socialNetworkType,
        })
        if (_socialNetwork) {
          throw e400('user is registered')
        }
        const checkByToken = await socialService
        .checkByToken(socialNetworkType, socialNetworkId, token)
        if (checkByToken) {
          throw e400('The token does not pass')
        }
        const user = await User.create(params)
        await user.addSocialNetwork(socialNetworkId, socialNetworkType, token)
        return user
      },
      async login(socialNetworkId, socialNetworkType, token) {
        const { SocialNetwork } = ctx.models
        const socialNetwork = await SocialNetwork.findOne({
          networkId: socialNetworkId,
          type: socialNetworkType,
        })
        if (!socialNetwork) {
          return false
        }
        const checkByToken = await socialService
        .checkByToken(socialNetworkType, socialNetworkId, token)
        if (!checkByToken) {
          throw e400('The token does not pass')
        }
        return User.findById(socialNetwork.userId)
      },
    },
    instanceMethods: {
      async addSocialNetwork(networkId, type, token) {
        const { SocialNetwork } = ctx.models
        if (!networkId) {
          throw e400('networkId is not found')
        }
        if (!type) {
          throw e400('type is not found')
        }
        if (!token) {
          throw e400('token is not found')
        }
        const existSocialNetwork = await SocialNetwork.findOne({
          where: {
            networkId,
            type,
          },
        })
        if (existSocialNetwork) {
          return existSocialNetwork
        }
        // Проверка что это действительно юзер из соц сети
        const checkByToken = await socialService.checkByToken(type, networkId, token)
        if (!checkByToken) {
          throw e400('The user is not found on the token')
        }
        // Создаем соц сеть
        await SocialNetwork.create({
          networkId,
          type,
          userId: this.get('id'),
        })
        return this.getSocialNetworks()
      },
      async removeSocialNetwork(type) {
        const { SocialNetwork } = ctx.models
        await SocialNetwork.destroy({
          where: {
            userId: this.get('id'),
            type,
          },
        })
        return this.getSocialNetworks()
      },
      async getSocialNetworks() {
        const { SocialNetwork } = ctx.models
        return SocialNetwork.findAll({
          where: {
            userId: this.get('id'),
          },
        })
      },
      async setUserLike(toUserId) {
        const { _checkNotFound } = ctx.helpers
        const { UserLike } = ctx.models
        const toUser = await User.findById(toUserId)
        .then(_checkNotFound('User'))
        let userLike = await UserLike.findOne({
          where: {
            fromUserId: this.get('id'),
            toUserId,
          },
        })
        if (!userLike) {
          userLike = await UserLike.create({
            fromUserId: this.get('id'),
            toUserId,
            value: 1,
          })
        }
        userLike.value = 1
        await userLike.save()
        await toUser.updateLikes()
        return toUser.save()
      },
      async removeUserLike(toUserId) {
        const { _checkNotFound } = ctx.helpers
        const { UserLike } = ctx.models
        const toUser = await User.findById(toUserId)
        .then(_checkNotFound('User'))
        await UserLike.destroy({
          where: {
            fromUserId: this.get('id'),
            toUserId: toUser.id,
            value: 1,
          },
        })
        await toUser.updateLikes()
        return toUser.save()
      },
      async setUserDislike(toUserId) {
        console.log('setuserDislike')
        const { _checkNotFound } = ctx.helpers
        const { UserLike } = ctx.models
        const toUser = await User.findById(toUserId)
        .then(_checkNotFound('User'))
        let userLike = await UserLike.findOne({
          where: {
            fromUserId: this.get('id'),
            toUserId,
          },
        })
        if (!userLike) {
          userLike = await UserLike.create({
            fromUserId: this.get('id'),
            toUserId,
            value: -1,
          })
        }
        userLike.value = -1
        await userLike.save()
        await toUser.updateLikes()
        return toUser.save()
      },
      async removeUserDislike(toUserId) {
        const { _checkNotFound } = ctx.helpers
        const { UserLike } = ctx.models
        const toUser = await User.findById(toUserId)
        .then(_checkNotFound('User'))
        await UserLike.destroy({
          where: {
            fromUserId: this.get('id'),
            toUserId: toUser.id,
            value: -1,
          },
        })
        await toUser.updateLikes()
        return toUser.save()
      },
      async isLikedByUser(userId) {
        const { UserLike } = ctx.models
        const like = await UserLike.findOne({
          where: {
            fromUserId: userId,
            toUserId: this.get('id'),
            value: 1,
          },
        })
        return !!like
      },
      async isDislikedByUser(userId) {
        const { UserLike } = ctx.models
        const like = await UserLike.findOne({
          where: {
            fromUserId: userId,
            toUserId: this.get('id'),
            value: -1,
          },
        })
        return !!like
      },
      async updateLikes() {
        const [likes, dislikes] = await Promise.all([
          this.getLikes(),
          this.getDislikes(),
        ])
        try {
          this.likes = likes.length
          this.dislikes = dislikes.length
        } catch (err) {
          this.likes = 0
          this.dislikes = 0
        }
      },
      async getLikes() {
        const { UserLike } = ctx.models
        return await UserLike.findAll({
          where: {
            toUserId: this.get('id'),
            value: 1,
          },
        })
      },
      async getDislikes() {
        const { UserLike } = ctx.models
        return await UserLike.findAll({
          where: {
            toUserId: this.get('id'),
            value: -1,
          },
        })
      },
      calculateAge(birthDate) {
        const birthMonth = birthDate.getMonth()
        const birthDay = birthDate.getDate()
        const birthYear = birthDate.getFullYear()
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const currentDay = currentDate.getDate()
        let calculatedAge = currentYear - birthYear
        if (currentMonth < birthMonth - 1) {
          calculatedAge--
        }
        if (birthMonth === currentMonth && currentDay < birthDay) {
          calculatedAge--
        }
        return calculatedAge
      },
      async getReferals() {
        const referal = this.get('id')
        return ctx.models.User.findAll({
          where: {
            referal,
          },
        })
      },
      getIdentity(params) {
        const object = _.pick(this, [
          'id',
          'firstName',
          'lastName',
          'email',
          'avatar',
          'role',
        ])
        if (!params) return object
        return Object.assign(object, params)
      },
      generateAuthToken(params) {
        return jwt.sign(this.getIdentity(params), ctx.config.jwt.secret)
      },
      // async verifyPassword(password) {
      //   // return this.password === password
      //   return await bcryptCompare(password, this.password)
      // },
      sendEmail(inputParams) {
        if (!transporter) {
          throw e500('!transporter')
        }
        let params = inputParams
        if (typeof params === 'string') {
          params = { text: params }
        }
        // console.log('Отпарвляю на ' + this.email)
        const options = Object.assign({ to: this.email }, ctx.config.mail.options, params)
        return transporter.sendMailAsync(options);
      },
      async getWall() {
        const { Wall } = ctx.models
        const wall = await Wall.findOne({
          where: {
            userId: this.get('id'),
          },
        })
        if (!wall || !wall.getPosts()) {
          return null
        }
        return wall
      },
      async getTickets() {
        const { Ticket } = ctx.models
        return Ticket.findAll({
          where: {
            userId: this.get('id'),
          },
        })
      },
      async getProducts() {
        const { Product } = ctx.models
        return Product.findAll({
          where: {
            ownerId: this.get('id'),
          },
        })
      },
      async getActions() {
        const { Action } = ctx.models
        return Action.findAll({
          where: {
            ownerId: this.get('id'),
          },
        })
      },
      async updateProductsCount() {
        const { Product } = ctx.models
        const count = await Product.count({
          where: {
            ownerId: this.get('id')
          },
        });
        this.productsCount = count;
        return this.save()
      },
      async addNewDevice(params) {
        const { Device } = ctx.models
        const deviceParams = {
          deviceId: params.deviceId,
          token: params.token,
          type: params.type,
          userId: this.get('id'),
        }
        try {
          const device = await Device.create(deviceParams)
          console.log(device)
        } catch (err) {
          console.error(err)
        }
        return this.getDevices()
      },
      async writePost(message, userId) {
        const { Post } = ctx.models
        const wall = await this.getWall()
        return Post.create({
          message,
          wallId: wall.id,
          userId,
        })
      },
      async getDevices() {
        const { Device } = ctx.models
        return Device.findAll({
          where: {
            userId: this.get('id')
          }
        })
      },
      async removeUserDevice(params = {}) {
        const { Device } = ctx.models
        if (!params.token && !params.deviceId) {
          return this.getDevices()
        }
        params.userId = this.get('id')
        await Device.destroy({
          where: params,
        })
        return this.getDevices()
      },
      async updateActionsCount() {
        const { Action } = ctx.models
        const actionsCount = await Action.count({
          where: {
            ownerId: this.get('id'),
          },
        })
        this.actionsCount = actionsCount
        return this.save()
      },
      async updateActionWinsCount() {
        const { Action } = ctx.models
        const actionWinsCount = await Action.count({
          where: {
            winnerId: this.get('id'),
          },
        })
        this.actionWinsCount = actionWinsCount
        return this.save()
      },
      async updateBuysCount() {
        const { Product } = ctx.models
        const buysCount = await Product.count({
          where: {
            buyerId: this.get('id'),
          },
        })
        this.buysCount = buysCount
        return this.save()
      },
      toJSON() {
        const user = this.dataValues
        const avatar = this.get('avatar')
        user.age = this.get('age')
        user.gyfi = Number(user.gyfi) || 0
        if (user.phoneNumbers && typeof user.phoneNumbers === 'string') {
          user.phoneNumbers = this.get('phoneNumbers')
          // user.phoneNumbers = [user.phoneNumbers]
        }
        if (avatar) {
          // user.avatar = `${ctx.config.protocol}://${ctx.config.host}${avatar}`
          const path = `${ctx.config.protocol}://${ctx.config.host}`;
          if (!user.avatar.startsWith(path)) {
            user.avatar = `${ctx.config.protocol}://${ctx.config.host}/${avatar}`
          }
        }
        return user
      },
    },
  })
  // User.beforeValidate(function (user, options, next) {
  //   console.log('beforeValidate')
  //   if (!Array.isArray(user.phoneNumbers)) {
  //     user.phoneNumbers = []
  //   }
  //   user.phoneNumbers = user.phoneNumbers.map(number => {
  //     if (typeof number !== 'string') {
  //       try {
  //         number = number.toString()
  //       } catch (err) {
  //         number = null
  //       }
  //     }
  //     return number
  //   })
  //   user.phoneNumbers.filter(number => {
  //     return number !== null
  //   })
  //   user.phoneNumbers = JSON.stringify(user.phoneNumbers)
  //   return next()
  // })
  User.afterDestroy(function (user) {
    const { SocialNetwork } = ctx.models
    return SocialNetwork.destroy({
      where: {
        userId: user.get('id'),
      },
    })
  })
  ctx.models.User = User
  return User
}
