/* eslint-disable */
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
      type: 'string',
    },
    {
      name:'actionId',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'price',
      in:'query',
      description: 'Стоимость билета',
      required: true,
      type: 'number',
    },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const properties = {}

  const paths = {
    '/ticket': {
      'get': {
        'summary': 'Получить список всех билетов',
        'tags': ['ticket'],
        'responses': {
          '200': {
            'description': 'Массив билетов',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/Ticket'
              }
            }
          }
        }
      },
      'post':{
        'summary': 'Создать новый билет',
        'tags': ['ticket'],
        'parameters':parameters,
        'responses': {
          '200': {
            'description': 'Билет',
            'schema': {
              '$ref': '#/definitions/Ticket'
            }
          }
        }
      }
    },
    '/ticket/{id}': {
      'parameters':[
        {
          'name': 'id',
          'in': 'path',
          'description':'id',
          'required': true,
          'type': 'string',
        },
      ],
      'get': {
        'summary': 'Найти билет по ID',
        'tags': ['ticket'],
        'responses': {
          '200': {
            'description': 'Билет',
            'schema': {
              '$ref': '#/definitions/Ticket'
            }
          }
        }
      },
      'put': {
        'summary': 'Изменить билет',
        'tags': ['ticket'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Билет',
            'schema': {
              '$ref': '#/definitions/Ticket'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить билет',
        'tags': ['ticket'],
        'responses': {
          '200': {
            'description': 'Билет',
            'schema': {
              '$ref': '#/definitions/Ticket'
            }
          }
        }
      },
    },
    '/ticket/buy': {
      'parameters': [
        {
          'name': 'actionId',
          'in': 'path',
          'description': 'id',
          'required': true,
          'type': 'number',
        },
        {
          'name': 'count',
          'in': 'path',
          'description': 'id',
          'required': false,
          'type': 'number',
        },
      ],
      'post': {
        'summary': '',
        'tags': ['ticket'],
        'responses': {
          '200': {
            'description': 'Купить билеты',
            'schema': {
              '$ref': '#/definitions/Ticket'
            }
          }
        }
      },
    }
  }

  const definitions = {
    Ticket: {
      type: 'object',
      properties: Object.assign(getPropertiesFromParams(parameters), {
        id: {
          type: 'string',
        },
      })
    }
  }

  return { paths, definitions }
}
