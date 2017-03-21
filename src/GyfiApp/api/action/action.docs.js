/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const {getPropertiesFromParams} = getDocsMethods()

export default(ctx, parent) => {

  const parameters = [
    {
      name: 'title',
      in: 'query',
      description: 'название',
      required: true,
      type: 'string'
    },
    // {
    //   name:'ownerId',
    //   in:'query',
    //   description: '',
    //   required: true,
    //   type: 'string',
    // },
    {
      name: 'categoryId',
      in: 'query',
      description: 'id категории',
      required: true,
      type: 'string'
    },
    {
      name: 'status',
      in: 'query',
      description: 'статус',
      required: false,
      type: 'string'
    },
    {
      name: 'images',
      in: 'formData',
      description: 'картинки',
      required: false,
      type: 'array',
      items: {
        type: 'string',
      }
    },
    {
      name: 'description',
      in: 'query',
      description: 'описание',
      required: false,
      type: 'string'
    },
    {
      name: 'price',
      in: 'query',
      description: 'Цена входа',
      required: false,
      type: 'number'
    },
    {
      name: 'vip',
      in: 'query',
      description: 'vip статус',
      required: false,
      type: 'boolean'
    },
    {
      name: 'vipTime',
      in: 'query',
      description: 'До какого времени будет VIP',
      required: false,
      type: 'string',
      format: 'date',
    },
    {
      name: 'finishedAt',
      in: 'query',
      description: 'дата окончания акции',
      required: true,
      type: 'string',
      format: 'date'
    },
    {
      name: 'fixedWinnerId',
      in: 'query',
      description: 'id фиксированного победителя',
      required: false,
      type: 'string'
    }
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id')
      param.required = false
    return param
  })

  putParameters.push({
    name: 'winnerId',
    in: 'query',
    description: '',
    required: false,
    type: 'string'
  },)

  const properties = {}

  const paths = {
    '/action': {
      'get': {
        'summary': 'Получить список всех акций',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Массив акций',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Action'
              }
            }
          }
        }
      },
      'post': {
        'summary': 'Создать новую акцию',
        'tags': ['action'],
        'parameters': parameters,
        'responses': {
          '200': {
            'description': 'Акция',
            'schema': {
              '$ref': '#/definitions/Action'
            }
          }
        }
      }
    },
    '/action/{id}': {
      'parameters': [
        {
          'name': 'id',
          'in': 'path',
          'description': 'id',
          'required': true,
          'type': 'string'
        }
      ],
      'get': {
        'summary': 'Найти акцию по ID',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Акция',
            'schema': {
              '$ref': '#/definitions/Action'
            }
          }
        }
      },
      'put': {
        'summary': 'Изменить акцию',
        'tags': ['action'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Акция',
            'schema': {
              '$ref': '#/definitions/Action'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить акцию',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Акция',
            'schema': {
              '$ref': '#/definitions/Action'
            }
          }
        }
      }
    },
    '/action/{id}/join': {
      'parameters': [
        {
          'name': 'id',
          'in': 'path',
          'description': 'id',
          'required': true,
          'type': 'string'
        }
      ],
      'post': {
        'summary': 'Учавствовать в акции',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Акция',
            'schema': {
              'type': 'object',
              'properties': {
                'action': {
                  '$ref': '#/definitions/Action'
                },
                'ticket': {
                  '$ref': '#/definitions/Ticket'
                }
              }
            }
          }
        }
      },
    },
    '/action/{id}/complete': {
      'parameters': [
        {
          'name': 'id',
          'in': 'path',
          'description': 'id',
          'required': true,
          'type': 'string'
        }
      ],
      'post': {
        'summary': 'Завершить акцию',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Акция',
            'schema': {
              '$ref': '#/definitions/Action'
            }
          }
        }
      },
    },
    '/action/{id}/users': {
      'parameters': [
        {
          'name': 'id',
          'in': 'path',
          'description': 'id',
          'required': true,
          'type': 'string'
        }
      ],
      'get': {
        'summary': 'Участники акции',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Пользователи',
            'schema': {
              'type': 'array',
              'items': {
                'type': 'number',
              }
            }
          }
        }
      },
    },
    '/action/{id}/tickets': {
      'parameters': [
        {
          'name': 'id',
          'in': 'path',
          'description': 'id',
          'required': true,
          'type': 'string'
        }
      ],
      'get': {
        'summary': 'Найти все билеты акции',
        'tags': ['action'],
        'responses': {
          '200': {
            'description': 'Билеты',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Ticket'
              }
            }
          }
        }
      },
    },
  }

  const definitions = {
    Action: {
      type: 'object',
      properties: Object.assign(getPropertiesFromParams(putParameters), {
        id: {
          type: 'string'
        },
        ownerId: {
          type: 'string'
        },
        winnerId: {
          type: 'string'
        }
      })
    }
  }

  return {paths, definitions}
}
