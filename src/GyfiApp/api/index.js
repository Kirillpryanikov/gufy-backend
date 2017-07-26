import asyncRouter from 'lego-starter-kit/utils/AsyncRouter';
import getDocs from './getDocs';
import getUserApi from './user/user.api'
import getProductApi from './product/product.api'
import getActionApi from './action/action.api'
import getTicketApi from './ticket/ticket.api'
import getWallApi from './wall/wall.api'
import getPostApi from './post/post.api'
import getCategoryApi from './category/category.api'
import getAuthApi from './auth/auth.api'
import getSocialNetworkApi from './socialNetwork/socialNetwork.api'
import getDeviceApi from './device/device.api';
import getValuesApi from './values/values.api';
import fileUpload from 'express-fileupload'

export default (ctx, params) => {
  const api = asyncRouter()

  const { e400, e404, e500 } = ctx.errors
  const { saveFile } = ctx.helpers
  const docsParams = Object.assign({}, params, {
    docs: `${params.basePath}/docs`,
    docsJson: `${params.basePath}/docs/json`,
  })
  const swaggerJson = getDocs(ctx, params)
  // Документация
  api.all('/', (req, res) => res.ok({ title: 'api', version: 1, docs: docsParams.docs , docsJson: docsParams.docsJson }))
  api.use('/docs', ctx.getDocsRouter(swaggerJson, docsParams))
  api.use('/auth', getAuthApi(ctx))
  // Авторизация
  // api.all('/auth/login', ctx.resourses.Auth.login)
  // api.all('/auth/signup', ctx.resourses.Auth.signup)
  // api.all('/auth/recovery', ctx.resourses.Auth.recovery)
  // Таблицы

  api.use('/user', getUserApi(ctx, params))
  api.use('/product', getProductApi(ctx, params))
  api.use('/action', getActionApi(ctx, params))
  api.use('/ticket', getTicketApi(ctx, params))
  api.use('/wall', getWallApi(ctx, params))
  api.use('/post', getPostApi(ctx, params))
  api.use('/category', getCategoryApi(ctx, params))
  api.use('/socialNetwork', getSocialNetworkApi(ctx, params))
  api.use('/device', getDeviceApi(ctx, params));
  api.use('/value', getValuesApi(ctx, params));
  // Все остальное

  api.post('/image', fileUpload(), async (req) => {
    if (req.files && req.files.image) {
      const { image } = req.files
      const filename = await ctx.helpers.saveFile(`${new Date().getTime()}`, image)
      return {
        fullPath: `${ctx.config.protocol}://${ctx.config.host}/${filename}`,
        path: `${filename}`,
      }
    } else {
      throw e400('Файл не передан')
    }
  })

  api.post('/file', fileUpload(), async (req) => {
    if (req.files && req.files.file) {
      const { file } = req.files
      let name = file.name
      if (name.indexOf('.') >= 0) {
        name = name.split('.')[0]
      }
      name += `_${new Date().getTime()}`
      const filename = await ctx.helpers.saveFile(name, file)
      return {
        fullPath: `${ctx.config.protocol}://${ctx.config.host}/${filename}`,
        path: `${filename}`,
      }
    } else {
      throw e400('Файл не передан')
    }
  })

  api.get('/auth/vkontakte',
  ctx.passport.authenticate('vkontakte', { scope: ['status', 'email', 'friends', 'notify', 'offline'] }));

  api.get('/auth/vkontakte/callback', async (req) => {
    return new Promise((resolve) => {
      (ctx.passport.authenticate('vkontakte', {}, (err, profile) => {
        return resolve(profile)
      }))(req)
    })
  })

  api.get('/auth/facebook', ctx.passport.authenticate('facebook'))

  api.get('/auth/facebook/callback', async (req) => {
    return new Promise((resolve) => {
      (ctx.passport.authenticate('facebook', {}, (err, profile) => {
        return resolve(profile)
      }))(req)
    })
  })

  api.get('/auth/odnoklassniki', ctx.passport.authenticate('odnoklassniki'),
  (req) => {
    return { params: req.allParams()}
  });

  api.get('/auth/odnoklassniki/callback', async (req) => {
    return new Promise((resolve) => {
      (ctx.passport.authenticate('odnoklassniki', {}, (err, profile) => {
        return resolve(profile)
      }))(req)
    })
  })

  api.all('/message/all', async (req) => {
    const { Message } = ctx.models
    return Message.findAll()
  })

  api.all('/message', async (req) => {
    const { Message, User } = ctx.models
    return Message.findAll({
      include: [
        {
          model: User,
          as: 'fromUser'
        },
        {
          model: User,
          as: 'toUser'
        },
      ]
    })
  })

  api.all('/user/update', async (req) => {
    const { User } = ctx.models
    const users = await User.findAll()
    const promises = users.map(user => {
      return user
      .updateActionsCount()
      .then(() => {
        return user.updateActionWinsCount()
      })
      .then(() => {
        return user.updateBuysCount()
      })
    })
    return Promise.all(promises)
  })
  api.all('/test2', async (req) => {
    const { Ticket } = ctx.models
    const tickets = await Ticket.findAll()
    const promises = tickets.map(ticket => {
      ticket.price = 1
      return ticket.save()
    })
    return Promise.all(promises)
  })
  api.all('/test3', async (req) => {
    const { Category } = ctx.models
    const categories = await Category.findAll()
    const promises = categories.map(category => {
      return category.updateProductsCount()
    })
    return Promise.all(promises)
  })

  api.all('*', () => {
    return {
      message: 'Api method not found'
    }
  })

  return api;
}
