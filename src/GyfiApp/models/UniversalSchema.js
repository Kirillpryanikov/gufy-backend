import mongoose from 'mongoose'
import _ from 'lodash'

export default class UniversalSchema {
  constructor(db, schema = {}, options = {}) {
    this.schema = schema
    this.options = options
    this.statics = {}
    this.methods = {}
    this.preMethods = {}
    this.postMethods = {}
    this.db = db
    // this.indexes = {}
  }

  extend(schema, options) {
    const object = new UniversalSchema()
    const fields = ['schema', 'options', 'statics', 'methods', 'preMethods', 'postMethods']
    fields.forEach(key => {
      object[key] = Object.assign({}, this[key])
    })
    Object.assign(object.schema, schema)
    Object.assign(object.options, options)
    return object
  }

  generateMongooseName(name = 'Model') {
    return name
  }

  getMongooseSchema() {
    const schema = new mongoose.Schema(this.schema, this.options)
    schema.statics = this.statics
    schema.methods = this.methods
    _.forEach(this.preMethods, (val, key) => {
      schema.pre(key, val)
    })
    _.forEach(this.postMethods, (val, key) => {
      schema.post(key, val)
    })
    return schema
  }

  pre(key, val) {
    this.preMethods[key] = val
  }

  post(key, val) {
    this.postMethods[key] = val
  }
}
