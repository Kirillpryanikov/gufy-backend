/**
 * Created by smartit-11 on 23.10.17.
 */
/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, parent) => {

  const parameters = [
    {
      name:'text',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'fromUserId',
      in:'query',
      description: 'id отправителя сообщения',
      required: false,
      type: 'number',
    },
    {
      name:'toUserId',
      in:'query',
      description: 'id получателя сообщения',
      required: false,
      type: 'number',
    },
  ];

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const properties = {}

  const paths = {
    '/chat': {
      'get': {
        'summary': 'Получить список последних сообщений пользователей с кем ввелась переписка',
        'tags': ['message'],
        'responses': {
          '200': {
            'description': 'Массив сообщений',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/Message'
              }
            }
          }
        }
      },
    },
    '/chat/:id/message': {
      'get': {
        'summary': 'Получить историю переписки',
        'tags': ['message'],
        'responses': {
          '200': {
            'description': 'Массив сообщений',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/Message'
              }
            }
          }
        }
      },
    },
  };

  const definitions = {
    Category: {
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
