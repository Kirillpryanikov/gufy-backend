import getSocialService from '../../services/social'
import getValidateService from '../../services/validate'
import _ from 'lodash'
export default (ctx) => {
  const { e400 } = ctx.errors
  const controller = {}
  const socialService = getSocialService(ctx)
  const validateService = getValidateService(ctx)
  const { User, SocialNetwork, Wall, Values } = ctx.models

  controller.signup = async (req) => {
    const params = req.allParams()
    const { token, socialNetworkId, socialNetworkType, referal } = params
    if (!token) {
      throw e400('access_token is not found')
    }
    if (!socialNetworkType) {
      throw e400('linkToSocialNetwork is not found')
    }
    if (!socialNetworkType) {
      throw e400('socialNetworkType is not found')
    }
    // Проверяем существет ли уже в системе
    const socialNetwork = await SocialNetwork.findOne({
      where: {
        networkId: socialNetworkId,
        type: socialNetworkType,
      },
    })
    let user = null
    // Если нашли какую то соц сеть
    if (socialNetwork) {
      console.log('Через эту соц сеть уже регались')
      console.log('ID зареганого юзера', socialNetwork.userId)
      // Пытаемя найти к какому юзеру она привязана
      user = await User.findById(socialNetwork.userId)
    }
    // Если юзера нет, создаем его
    if (!user) {
      console.log('Но я не нашел по ней юзера')
      const checkByToken = await socialService
      .checkByToken(socialNetworkType, socialNetworkId, token)
      if (!checkByToken) {
        throw e400('The token does not pass')
      }
      params.network = socialNetworkType
      user = await User.create(params)
      await user.addSocialNetwork(socialNetworkId, socialNetworkType, token)
      await Wall.create({ userId: user.id })

      if (referal) {
        const price = await Values.find({
          where: {
            name: 'referal-id',
          },
        });
        let inviterUser = await User.findById(referal);

        if (inviterUser) {
          inviterUser.gyfi += parseInt(price.value, 10);
          user.gyfi += parseInt(price.value, 10);
          inviterUser.save();
          user.save();
        }
      }
    }
    // return user
    const emailOptions = {
      subject: 'Регистрация на сайте',
      text: 'Поздравляем с регистрацией',
    }

    user.sendEmail(emailOptions)
    return {
      user,
      token: user.generateAuthToken(),
    }
  }

  controller.login = async (req) => {
    const params = req.allParams()
    const { socialNetworkType, socialNetworkId, token } = params
    console.log({ socialNetworkType, socialNetworkId, token })
    const socialNetwork = await SocialNetwork.findOne({
      where: {
        networkId: socialNetworkId,
        type: socialNetworkType,
      },
    })
    if (!socialNetwork) {
      return {
        status: 'failed',
        message: 'The user is not registered in the system',
      }
    }
    console.log({ socialNetwork })
    const checkByToken = await socialService
    .checkByToken(socialNetworkType, socialNetworkId, token)
    if (!checkByToken) {
      throw e400('The token does not pass')
    }
    console.log({ checkByToken })
    const user = await User.findById(socialNetwork.userId)

    if (!user) {
      return {
        status: 'failed',
        message: 'The user is not registered in the system',
      }
    }

    return {
      status: 'success',
      __pack: 1,
      user,
      token: user.generateAuthToken(),
    }
  }
  controller.validate = async (req) => {
    const params = req.allParams() || {}
    const validates = {}
    _.mapValues(params, (value, key) => {
      validates[key] = true
    })
    return validates
  }
  return controller
}
