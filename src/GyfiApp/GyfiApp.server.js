import ReactApp from 'lego-starter-kit/ReactApp'
import getApi from './api'
import routes from './routes'
import assets from './assets'; // eslint-disable-line import/no-unresolved
import UniversalRouter from 'universal-router';
import ReactDOM from 'react-dom/server';
import Html from './components/Html'
import getModels from './models'
import bodyParser from 'body-parser'
import getDocsTemplate from './getDocsTemplate'
import asyncRouter from 'lego-starter-kit/utils/AsyncRouter'
import Sequelize from 'sequelize'
import SequelizeJson from 'sequelize-json'
// middlewares
import logger from './middleware/logger'
import bodyparser from './middleware/bodyparser'
import reqRes from './middleware/reqRes'
// passport
import Vkontakte from 'passport-vkontakte'
import Facebook from 'passport-facebook'
import Odnoklassniki from 'passport-ok-strategy'
import passport from 'passport'
import getSocialService from './services/social'
import fetch from 'node-fetch'
import getSchedule from './services/schedule'

import socketIO from 'socket.io'
import getSockets from './sockets'

//HTML
import getSocketHTML from './html/socket'

export default class GyfiApp extends ReactApp {
  init() {
    this.addStrategy()
    super.init()
    this.responses = require('./responses')
    // Подключаем сервисы
    this.initServices()
    this.afterInit()
    // this.addHelpers()
  }
  afterInit() {
    this.useSocketIO()
  }
  // Подключаем socketIO
  useSocketIO() {
    const io = socketIO(this)
    io.attach(this.appServer)
    io.set('transports', ['websocket']);
    this.io = io
    this.io = getSockets(this)
  }
  useWebSockets() {}
  initServices() {
    this.Schedule = getSchedule(this)
  }
  addStrategy() {
    const socialService = getSocialService(this)
    this.strategy = {}
    const vk = Vkontakte.Strategy
    const fb = Facebook.Strategy
    const ok = Odnoklassniki.Strategy
    this.strategy.Vkontakte = vk
    this.strategy.Facebook = fb
    this.strategy.Odnoklassniki = ok
    passport.use(new this.strategy.Vkontakte({
      clientID: this.config.social.vk.clientID,
      clientSecret: this.config.social.vk.clientSecret,
      callbackURL: `${this.config.url}/auth/vkontakte/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
      // console.log({
      //   accessToken,
      //   refreshToken,
      //   profile,
      // })
      // const checkByToken = await socialService.checkByToken('vk', profile.id, accessToken)
      // console.log({ checkByToken })
      // if (checkByToken) {
      //   console.log('Успешная проверка')
      // }
      // if (!checkByToken) {
      //   console.log('Не успешная проверка')
      // }
      return done(null, { accessToken, refreshToken, profile })
    }
    ));
    passport.use(new this.strategy.Facebook({
      clientID: this.config.social.fb.clientID,
      clientSecret: this.config.social.fb.clientSecret,
      callbackURL: `${this.config.url}/auth/facebook/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
      // console.log({
      //   accessToken,
      //   refreshToken,
      //   profile,
      // })
      // const checkByToken = await socialService.checkByToken('fb', profile.id, accessToken)
      // console.log({ checkByToken })
      // if (checkByToken) {
      //   console.log('Успешная проверка')
      // }
      // if (!checkByToken) {
      //   console.log('Не успешная проверка')
      // }
      return done(null, { accessToken, refreshToken, profile })
    }
    ));
    passport.use(new this.strategy.Odnoklassniki(this.config.social.ok,
      async (accessToken, refreshToken, profile, done) => {
        // console.log({
        //   accessToken,
        //   refreshToken,
        //   profile,
        // })
        // console.log(profile)
        // const checkByToken = await socialService.checkByToken('ok', profile.id, accessToken)
        // console.log({ checkByToken })
        // if (checkByToken) {
        //   console.log('Успешная проверка')
        // }
        // if (!checkByToken) {
        //   console.log('Не успешная проверка')
        // }
        return done(null, { accessToken, refreshToken, profile })
      }
    ));
    this.passport = passport
    return this
  }

  getDocsRouter(json, params) {
    const api = asyncRouter()
    const url = params.basePath + '/docs/json'
    api.all('/json', (req, res) => res.send(json))
    const params2 = Object.assign({}, params, { url, name: this.config.name })
    const docParams = Object.assign(params2, this.config.swagger)
    api.all('/', (req, res) => res.send(getDocsTemplate(docParams)))
    return api
  }

  addHelpers() {
    const { errors } = this
    this.helpers.saveFile = async function saveFile(title, file) {
      const dirname = __dirname + '/public'
      const type = file.mimetype.split('/')[1] || 'png'
      const filename = `/storage/${title}.${type}`
      await Promise.promisify(file.mv)([dirname, filename].join('/'))
      return filename
    }
    this.helpers.isAuth = function isAuth(req) {
      if (!req.user || !req.user.id) throw errors.e401('!req.user')
    }
    this.helpers._checkNotFound = function _checkNotFound(model = 'Object') {
      return function checkNotFound(data) {
        if (!data) throw errors.e404(`${model} not found`)
        return Promise.resolve(data)
      }
    }
    return this
  }
  getModels() {
    const sqlConfig = this.config.sql
    const sequelize = new Sequelize(sqlConfig.database, sqlConfig.username, sqlConfig.password,
      { host: sqlConfig.host, port: sqlConfig.port, pool: false }
    )
    sequelize.jsonField = SequelizeJson
    this.sequelize = sequelize
    this.models = {}
    this.models = getModels(this)
    this.sequelize.sync().then(() => {})
    // const superModels = super.getModels()
    // const models = getModels(this)
    // return Object.assign(superModels)
    return this.models
  }

  beforeUseMiddlewares() {
    this.addHelpers()
    this.app.use(reqRes(this))
    this.app.use(logger(this))
    this.app.use(bodyparser(this))
    this.app.use(this.helpers.parseUser)
    // this.app.use(this.passport.initialize())
  }

  useRoutes() {
    // const Project = this.models.Project
    // this.app.get('/', (req, res) => {
    //   return res.send(this.renderHtml(<div>Lupus home</div>))
    // })
    this.app.all('/sockets', (req, res) => {
      return res.send(getSocketHTML())
    })
    this.app.all('/api', (req, res) => {
      return res.json({message: 'Current api is here: /api/v1', url: '/api/v1'})
    })
    this.app.use('/api/v1', getApi(this, {
      host: this.config.host,
      basePath: '/api/v1'
    }))
    this.app.use('/', getApi(this, {
      host: this.config.host,
      basePath: '/api/v1'
    }))

    this.app.get('*', this.applyUniversalRouter(routes, {script: assets.main.js}));
    this.useStaticPublic(__dirname + '/../../public')
  }
  applyUniversalRouter(routes, data) {
    return async(req, res, next) => {
      try {
        let css = [];
        let statusCode = 200;

        await UniversalRouter.resolve(routes, {
          path: req.path,
          query: req.query,
          context: {
            insertCss: (...styles) => {
              styles.forEach(style => css.push(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
            },
            setTitle: value => (data.title = value),
            setMeta: (key, value) => (data[key] = value)
          },
          render(component, status = 200) {
            css = [];
            statusCode = status;
            data.children = ReactDOM.renderToString(component);
            data.style = css.join('');
            return true;
          }
        });
        const html = ReactDOM.renderToStaticMarkup(<Html {...data}/>);

        res.status(statusCode);
        res.send(`<!doctype html>${html}`);
      } catch (err) {
        console.log('err', err)
        next(err);
      }
    }
  }

  useDefaultRoute() {
    this.app.use('*', (req, res) => res.err(this.errors.e404('Route not found')))
  }
}
