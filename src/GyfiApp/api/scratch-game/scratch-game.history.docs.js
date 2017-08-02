
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, parent) => {
  const parameters = [
    {
      name:'userId',
      in:'query',
      description: '',
      required: true,
      type: 'number',
    },
    {
      name:'prizeId',
      in:'query',
      description: '',
      required: true,
      type: 'number',
    },
    {
      name:'dateGame',
      in:'query',
      description: '',
      required: true,
      type: 'date',
    },
    {
      name:'percentWin',
      in:'query',
      description: '',
      required: true,
      type: 'number',
    },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const paths = {
    '/scratch/history': {
      'get' : {
        'summary': 'Получить список всей истории игры',
        'tags': ['history'],
        'responses': {
          '200': {
            'description': 'Объект',
            'schema': {
              'type': 'object',
              'items':{
                '$ref': '#/definitions/ScratchGameHistory'
              }
            }
          }
        }
      }
    },

    '/scratch/history/:id': {
      'put' : {
        'summary': 'Изменить приз',
        'tags': ['history'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'History Scratch Game',
            'schema': {
              '$ref': '#/definitions/ScratchGameHistory'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить историю',
        'tags': ['history'],
        'responses': {
          '200': {
            'description': 'История',
            'schema': {
              '$ref': '#/definitions/ScratchGameHistory'
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
