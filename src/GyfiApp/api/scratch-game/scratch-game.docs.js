/**
 * Created by smartit-11 on 28.07.17.
 */

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
      name:'image',
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
    {
      name:'weightVictory',
      in:'query',
      description: '',
      required: true,
      type: 'number',
    },
    {
      name:'inStoke',
      in:'query',
      description: '',
      required: false,
      type: 'boolean',
    },
    {
      name:'countPrize',
      in:'query',
      description: '',
      required: false,
      type: 'number',
    },
    {
      name:'isAvaible',
      in:'query',
      description: '',
      required: false,
      type: 'boolean',
    },
    {
      name:'isGyfi',
      in:'query',
      description: '',
      required: true,
      type: 'boolean',
    },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const paths = {
    '/scratch': {
      'post': {
        'summary': 'Создать приз',
        'tags': ['prize'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Значение',
            'schema': {
              '$ref': '#/definitions/ScratchGamePrize'
            }
          }
        }
      },
    },

    '/scratch/prizes': {
      'get' : {
        'summary': 'Получить список всех призов',
        'tags': ['prize'],
        'responses': {
          '200': {
            'description': 'Объект',
            'schema': {
              'type': 'object',
              'items':{
                '$ref': '#/definitions/ScratchGamePrize'
              }
            }
          }
        }
      }
    },
    '/scratch/prize/:id': {
      'put' : {
        'summary': 'Изменить приз',
        'tags': ['prize'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Prize',
            'schema': {
              '$ref': '#/definitions/ScratchGamePrize'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить приз',
        'tags': ['prize'],
        'responses': {
          '200': {
            'description': 'Приз',
            'schema': {
              '$ref': '#/definitions/ScratchGamePrize'
            }
          }
        }
      }
    },
    '/scratch/game': {
      'get': {
        'summary': 'Получить 12 призов для игры',
        'tags': ['prize'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Приходит 12 элементов, где приз определяется тремя повторениями',
            'schema': {
              '$ref': '#/definitions/ScratchGamePrize'
            }
          }
        }
      },
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
