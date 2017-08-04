/* eslint key-spacing:0 spaced-comment:0 */
import _debug from 'debug'
import path from 'path'
import { argv } from 'yargs'
const pkg = require('../../package.json')

const config = {
  name: 'Gyfi',
  env : process.env.NODE_ENV || process.env.ENV || 'development',
  port : process.env.PORT || 8081,
  host: '185.65.247.3',
  // host: 'localhost',
  protocol: 'http',
  // protocol: 'https',
  // host: 'gyfi.mgbeta.ru',
  sql: {
   host: 'legend02.mysql.ukraine.com.ua',
   // port: 10096,
   password: '2lwxswfy',
   username: 'legend02_gufy',
   database: 'legend02_gufy',
  },
  //  sql: {
  //    host: 's3.mgbeta.ru',
  //    port: 10096,
  //    password: 'NdhgpGh3ODNXYZd0zPZc',
  //    username: 'mgbeta',
  //    database: 'mgbeta',
  //  },
  social: {
    vk: {
      clientID: '5717694',
      clientSecret: 'o1quBEHhCa8OwCKdmdH5',
    },
    fb: {
      clientID: '1431817303513492',
      clientSecret: 'd9f3585770a1819b9a05c07b709d840c',
    },
    ok: {
      clientID: '1248740352',
      clientPublic: 'CBAFEPGLEBABABABA',
      clientSecret: 'A7F2B0DF0A7B249926DD7304',
    },
  },
  mail: {
    transport: {
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'dev@mgbeta.ru',
        pass: '1CJbEagFlLBHYNBVrL4h',
      },
    },
    options: {
      from: '"Dev Mgbeta" <dev@mgbeta.ru>',
    },
  },
  db: {
    uri: 'mongodb://gufyuser:gufyuser@ds161001.mlab.com:61001/mongo-gufy',
    options: {},
  },
  jwt: {
    secret: 'qweqweqwe12312312',
    devToken: '',
  },
}

config.url = `${config.protocol}://${config.host}`
if (config.port && config.protocol !== 'https') {
  config.url += `:${config.port}`
  config.host += `:${config.port}`
}
if (config.social.ok) {
  config.social.ok.callbackURL = `${config.url}/auth/odnoklassniki/callback`
}

  // env : process.env.NODE_ENV || process.env.ENV || 'development',
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__DEBUG__'    : config.env === 'development' && !process.env.NODEBUG,
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
}

export default config
