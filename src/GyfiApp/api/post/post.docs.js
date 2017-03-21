/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, parent) => {

  const parameters = [
    {
      name:'message',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'userId',
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

  const properties = {}

  const paths = {
    '/post': {
      'get': {
        'summary': 'Получить массив всех сообщений',
        'tags': ['post'],
        'responses': {
          '200': {
            'description': 'Массив сообщений',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/post'
              }
            }
          }
        }
      },
      'post':{
        'summary': 'Создать новое сообщение',
        'tags': ['post'],
        'parameters':parameters,
        'responses': {
          '200': {
            'description': 'Сообщение',
            'schema': {
              '$ref': '#/definitions/Post'
            }
          }
        }
      }
    },
    '/post/{id}': {
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
        'summary': 'Найти сообщение по ID',
        'tags': ['post'],
        'responses': {
          '200': {
            'description': 'Сообщение',
            'schema': {
              '$ref': '#/definitions/Post'
            }
          }
        }
      },
      'put': {
        'summary': 'Изменить сообщение',
        'tags': ['post'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Сообщение',
            'schema': {
              '$ref': '#/definitions/Post'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить сообщение',
        'tags': ['post'],
        'responses': {
          '200': {
            'description': 'Сообщение',
            'schema': {
              '$ref': '#/definitions/Post'
            }
          }
        }
      },
    }
  }

  const definitions = {
    Post: {
      type: 'object',
      properties: Object.assign(getPropertiesFromParams(putParameters), {
        id: {
          type: 'string',
        },
      })
    }
  }

  return { paths, definitions }
}
