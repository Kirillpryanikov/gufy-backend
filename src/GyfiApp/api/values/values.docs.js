
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
      '/value': {
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
    }
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
