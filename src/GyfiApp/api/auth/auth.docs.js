/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, userDocs) => {
  const userParameters = userDocs.parameters

  const loginParameters = [
    {
      name:'socialNetworkId',
      in:'query',
      description: 'ID в социальной сети',
      required: true,
      type: 'string',
    },
    {
      name:'socialNetworkType',
      in:'query',
      description: 'vk/fb/ok',
      required: true,
      type: 'string',
    },
    {
      name:'token',
      in:'query',
      description: 'access_token',
      required: true,
      type: 'string',
    },
  ]

  const validateParameters = [
    {
      name:'username',
      in:'query',
      description: 'username',
      required: false,
      type: 'string',
    },
  ]

  const signUpParameters = [...userParameters, ...loginParameters]

  const properties = {}

  const paths = {
    '/auth/signup': {
      'post': {
        'summary': 'Зарегистрировать нового пользователя',
        'tags': ['auth'],
        'parameters': signUpParameters,
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              'type': 'object',
              'properties': {
                'user': {
                  '$ref': '#/definitions/User'
                },
                'token': {
                  'type': 'string',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      'post': {
        'summary': 'Получить пользователя по ID',
        'tags': ['auth'],
        'parameters': loginParameters,
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              'type': 'object',
              'properties': {
                'user': {
                  '$ref': '#/definitions/User'
                },
                'token': {
                  'type': 'string',
                },
              },
            },
          },
        },
      },
    },
    // '/auth/validate': {
    //   'post': {
    //     'summary': 'Проверить допустимость некоторых полей при регистрации',
    //     'tags': ['auth'],
    //     'parameters': validateParameters,
    //     'responses': {
    //       '200': {
    //         'description': 'Пользователь',
    //         'schema': {
    //           'type': 'object',
    //         },
    //       },
    //     },
    //   },
    // },
  }

  const definitions = {}

  return { paths, definitions }
}
