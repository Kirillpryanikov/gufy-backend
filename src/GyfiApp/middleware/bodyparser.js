import xmlparser from 'express-xml-bodyparser'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import _ from 'lodash'

export default (ctx) => ([
  // bodyParser.json(),
  // bodyParser.urlencoded({ extended: true }),

  bodyParser.json({limit: '50mb'}),
  bodyParser.urlencoded({limit: '50mb', extended: true }),
  // xmlparser(),
  cookieParser(),
  cors(),
  // cors({"origin": __DEV__ ? "*" : "vote.mgbeta.ru"}),
  // (req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // },

])
