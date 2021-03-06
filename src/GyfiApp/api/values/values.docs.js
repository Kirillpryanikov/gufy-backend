
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, parent) => {
  const parameters = [
    {
      name:'name',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'value',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'description',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const paths = {
      '/option': {
      'get': {
        'summary': 'Получить список всех значений',
          'tags': ['value'],
          'responses': {
          '200': {
            'description': 'Массив значений',
              'schema': {
              'type': 'array',
                'items':{
                '$ref': '#/definitions/Value'
              }
            }
          }
        }
      },

        'put': {
          'summary': 'Изменить значение',
          'tags': ['value'],
          'parameters': putParameters,
          'responses': {
            '200': {
              'description': 'Значение',
              'schema': {
                '$ref': '#/definitions/Values'
              }
            }
          }
        },
    },

    '/option/cost/viptime': {
        'get' : {
          'summary': 'Получить стоимость vipTime за один час',
          'tags': ['object'],
          'responses': {
            '200': {
              'description': 'Объект',
              'schema': {
                'type': 'object',
                'items':{
                  '$ref': '#/definitions/Value'
                }
              }
            }
        }
      }
    },
    '/option/cost/scratch-game': {
      'get' : {
        'summary': 'Получить стоимость Scratch Game',
        'tags': ['object'],
        'responses': {
          '200': {
            'description': 'Объект',
            'schema': {
              'type': 'object',
              'items':{
                '$ref': '#/definitions/Value'
              }
            }
          }
        }
      }
    },
    '/option/cost/free-gyfi': {
      'get' : {
        'summary': 'Получить количество бесплатных Gyfi',
        'tags': ['object'],
        'responses': {
          '200': {
            'description': 'Объект',
            'schema': {
              'type': 'object',
              'items':{
                '$ref': '#/definitions/Value',
              }
            }
          }
        }
      }
    },
  }

  const definitions = {
    Values: {
      type: 'object',
      properties: Object.assign(getPropertiesFromParams(parameters), {
        banned: {
          type: 'boolean',
          default: false,
        },
        promo_code: {
          type: 'string',
        },
      })
    }
  }

  return { paths, definitions, parameters }

}
