/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods();

export default(ctx, parent) => {
  const parameters = [
    {
      name:'text',
      in:'query',
      description: 'Message to support',
      required: true,
      type: 'string',
    },
    {
      name:'userId',
      in:'query',
      description: 'ID user',
      required: true,
      type: 'number',
    },
  ];

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const properties = {}

  const paths = {
    '/support': {
      'get': {
        'summary': 'Получить список непрочитанных сообщений',
        'tags': ['support'],
        'responses': {
          '200': {
            'description': 'Массив сообщений',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Support'
              }
            }
          }
        }
      },
      'post': {
        'summary': 'отправить сообщение',
        'tags': ['support'],
        'parameters': parameters,
        'responses': {
          '200': {
            'description': 'Отправка сообщения в тех. поддержку',
            'schema': {
              '$ref': '#/definitions/Support'
            }
          }
        }
      }
    },
    'support/read/{id}': {
      'parameters': [
        {
          'name': 'id',
          'in': 'path',
          'description': 'id user',
          'required': true,
          'type': 'number',
        },
      ],
      'get': {
        'summary': 'Отметить сообщения пользователя как прочитанные',
        'tags': ['support'],
        'parameters': '',
        'responses': {
          '200': {
            'description': 'Отметить сообщения пользователя как прочитанные',
            'schema': {
              '$ref': '#/definitions/Support'
            }
          }
        }
      },
      '/support/{id}/messages': {
        'parameters': [
          {
            'name': 'id',
            'in': 'path',
            'description': 'id user',
            'required': true,
            'type': 'number',
          },
        ],
        'get': {
          'summary': 'Получить сообщения к тех. поддержке по user Id',
          'tags': ['support'],
          'responses': {
            '200': {
              'description': 'Получить массив сообщений к тех. поддержке по user Id',
              'schema': {
                'type': 'array',
                'items': {
                  '$ref': '#/definitions/Support'
                }
              }
            }
          }
        },
      },
    },
  };

  const definitions = {
    Support: {
      type: 'object',
      properties: Object.assign(getPropertiesFromParams(parameters), {
        id: {
          type: 'string',
        },
      }),
    },
  };
  return { paths, definitions }
}
