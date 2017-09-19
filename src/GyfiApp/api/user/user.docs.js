/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, parent) => {

  const parameters = [
    // {
    //   name:'username',
    //   in:'query',
    //   description: 'Должно быть уникальным',
    //   required: true,
    //   type: 'string',
    // },
    {
      name:'firstName',
      in:'query',
      description: 'Имя',
      required: false,
      type: 'string',
    },
    {
      name:'lastName',
      in:'query',
      description: 'Фамилия',
      required: false,
      type: 'string',
    },
    {
      name:'role',
      in:'query',
      description: 'user/admin',
      required: false,
      type: 'string',
    },
    {
      name:'type',
      in:'query',
      description: 'user/company',
      required: false,
      type: 'string',
    },
    {
      name:'gender',
      in:'query',
      description: 'Пол',
      required: false,
      type: 'string',
    },
    {
      name:'gyfi',
      in:'query',
      description: 'Валюта',
      required: false,
      type: 'number',
    },
    {
      name:'avatar',
      in:'query',
      description: 'Передавать сюда поле path из запроса POST /image',
      required: false,
      type: 'string',
    },
    {
      name:'email',
      in:'query',
      description: 'email',
      required: true,
      type: 'string',
    },
    {
      name:'status',
      in:'query',
      description: 'Статус',
      required: false,
      type: 'string',
    },
    {
      name:'bdate',
      in:'query',
      description: 'Date BirtDay',
      required: false,
      type: 'string',
    },
    {
      name:'city',
      in:'query',
      description: 'Город',
      required: false,
      type: 'string',
    },
    {
      name:'phoneNumbers',
      in:'formData',
      description: 'Телефон',
      required: true,
      type: 'array',
      items: {
        type: 'string',
      }
    },
    {
      name:'referal',
      in:'query',
      description: 'ID пригласившего юзера',
      required: false,
      type: 'string',
    },
    {
      name:'productsCount',
      in:'query',
      description: 'Количество товаров',
      required: false,
      type: 'number',
    },
    // {
    //   name:'promo_code',
    //   in:'query',
    //   description: '',
    //   required: false,
    //   type: 'string',
    // },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const properties = {}

  const paths = {
    '/user': {
      'get': {
        'summary': 'Получить список всех пользователей',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Массив пользователей',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/User'
              }
            }
          }
        }
      },
    },
    '/user/{id}/like': {
      'parameters':[
        {
          'name': 'id',
          'in': 'path',
          'description':'id',
          'required': true,
          'type': 'string',
        },
      ],
      'get':{
        'summary': 'Проверить поставил ли юзеру лайк или дизлайк',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Лайк и Дизлайк',
            'schema': {
              'type': 'object',
              'properties': {
                'like': {
                  'type': 'boolean',
                },
                'dislike': {
                  'type': 'boolean',
                },
              }
            },
          },
        },
      },
      'post':{
        'summary': 'Поставить лайк пользователю',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            },
          },
        },
      },
      'delete':{
        'summary': 'Убрать лайк пользователю',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            },
          },
        },
      },
    },
    '/user/{id}/dislike': {
      'parameters':[
        {
          'name': 'id',
          'in': 'path',
          'description':'id',
          'required': true,
          'type': 'string',
        },
      ],
      'post':{
        'summary': 'Поставить лайк пользователю',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            },
          },
        },
      },
      'delete':{
        'summary': 'Убрать лайк пользователю',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            },
          },
        },
      },
    },
    '/user/{id}': {
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
        'summary': 'Получить пользователя по ID',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            }
          }
        }
      },
      'put': {
        'summary': 'Изменить пользователя',
        'tags': ['user'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить пользователя',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            }
          }
        }
      },
    },
    '/user/me': {
      'get': {
        'summary': 'Получить информацию о моем пользователе',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Пользователь',
            'schema': {
              '$ref': '#/definitions/User'
            }
          }
        }
      },
    },
    '/user/{id}/wall': {
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
        'summary': 'Получить все сообщения со стены пользователя',
        'tags': ['post', 'user'],
        'responses': {
          '200': {
            'description': 'Стена пользователя',
            'schema': {
              'type': 'object',
              'properties': {
                'wall': {
                  '$ref': '#/definitions/Wall'
                },
                'posts': {
                  'type': 'array',
                  'items': {
                    '$ref': '#/definitions/Post'
                  }
                }
              },
            },
          },
        },
      },
    },
    '/user/{id}/products': {
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
        'summary': 'Найти все товары пользователя',
        'tags': ['product', 'user'],
        'responses': {
          '200': {
            'description': 'Товары пользователя',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Product'
              },
            },
          },
        },
      },
    },
    '/user/{id}/actions': {
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
        'summary': 'Найти все акции пользователя',
        'tags': ['action', 'user'],
        'responses': {
          '200': {
            'description': 'Акции пользователя',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Action'
              },
            },
          },
        },
      },
    },
    '/user/{id}/tickets': {
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
        'summary': 'Найти все билеты пользователя',
        'tags': ['ticket', 'user'],
        'responses': {
          '200': {
            'description': 'Билеты пользователя',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Ticket'
              },
            },
          },
        },
      },
    },
    '/user/{id}/referals': {
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
        'summary': 'Найти всех рефералов юзера',
        'tags': ['ticket', 'user'],
        'responses': {
          '200': {
            'description': 'Билеты пользователя',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/User'
              },
            },
          },
        },
      },
    },
    '/image': {
      'post': {
        'summary': 'Загрузить картинку',
        'tags': ['image'],
        'parameters':[
          {
            'name': 'image',
            'in': 'formData',
            'description':'изображение',
            'required': true,
            'type': 'file',
          },
        ],
        'responses': {
          '200': {
            'description': 'Путь',
            'schema': {
              'type': 'object',
              'properties': {
                'path': {
                  'type': 'string',
                },
                'fullPath': {
                  'type': 'string',
                },
              }
            },
          },
        },
      },
    },
    '/file': {
      'post': {
        'summary': 'Загрузить файл',
        'tags': ['file'],
        'parameters':[
          {
            'name': 'file',
            'in': 'formData',
            'description':'файл',
            'required': true,
            'type': 'file',
          },
        ],
        'responses': {
          '200': {
            'description': 'Путь',
            'schema': {
              'type': 'object',
              'properties': {
                'path': {
                  'type': 'string',
                },
                'fullPath': {
                  'type': 'string',
                },
              }
            },
          },
        },
      },
    },
    '/user/social': {
      'post': {
        'summary': 'Подключить социальную сеть',
        'tags': ['user'],
        'parameters':[
          {
            'name': 'socialNetworkId',
            'in': 'query',
            'description':'id',
            'required': true,
            'type': 'string',
          },
          {
            'name': 'socialNetworkType',
            'in': 'query',
            'description':'id',
            'required': true,
            'type': 'string',
          },
          {
            'name': 'token',
            'in': 'query',
            'description':'id',
            'required': true,
            'type': 'string',
          },
        ],
        'responses': {
          '200': {
            'description': 'Список соц сетей',
            'schema': {
              'type': 'array',
            },
          },
        },
      },
      'delete': {
        'summary': 'Отключить социальную сеть',
        'tags': ['user'],
        'parameters':[
          {
            'name': 'socialNetworkType',
            'in': 'query',
            'description':'id',
            'required': true,
            'type': 'string',
          },
        ],
        'responses': {
          '200': {
            'description': 'Список соц сетей',
            'schema': {
              'type': 'array',
            },
          },
        },
      },
    },
    '/user/freegyfi': {
      'get': {
        'summary': 'Получить беспланые гуфи',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Бесплатные гуфи можно получить один раз за сутки',
            'schema': {
              'type': '',
              'items': {
                '$ref': '#/definitions/FreeGyfi'
              }
            },
          },
        },
      },
    },
    '/user/freegyfi/time': {
      'get': {
        'summary': 'Получить время/дату следующих бесплатных гуфи',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Время/Дата для получения бесплатных гуфи',
            'schema': {
              'type': '',
              'items': {
                '$ref': '#/definitions/FreeGyfi'
              }
            },
          },
        },
      },
    },
    '/user/banner': {
      'get': {
        'summary': 'Получить беспланые гуфи',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Бесплатные гуфи можно получить после просмотра видео контента',
            'schema': {
              'type': '',
              'items': {
                '$ref': '#/definitions/FreeGyfi'
              }
            },
          },
        },
      },
    },
    '/user/device': {
      'get': {
        'summary': 'Получить список устройств юзера',
        'tags': ['user'],
        'responses': {
          '200': {
            'description': 'Список устройств юзера',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Device'
              }
            },
          },
        },
      },
      'post': {
        'summary': 'Добавить устройство к юзеру',
        'tags': ['user'],
        'parameters':[
          {
            'name': 'deviceId',
            'in': 'query',
            'description':'Id устройства',
            'required': true,
            'type': 'string',
          },
          {
            'name': 'token',
            'in': 'query',
            'description':'Токен устройства',
            'required': true,
            'type': 'string',
          },
          {
            'name': 'type',
            'in': 'query',
            'description':'android/ios',
            'required': true,
            'type': 'string',
          },
        ],
        'responses': {
          '200': {
            'description': 'Список устройств юзера',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Device'
              }
            },
          },
        },
      },
      'delete': {
        'summary': 'Удалить устройство юзера',
        'description': 'Можно удалить устройство по токену или по id',
        'tags': ['user'],
        'parameters':[
          {
            'name': 'deviceId',
            'in': 'query',
            'description':'id',
            'required': false,
            'type': 'string',
          },
          {
            'name': 'token',
            'in': 'query',
            'description':'Токен утсройства',
            'required': false,
            'type': 'string',
          },
        ],
        'responses': {
          '200': {
            'description': 'Список устройств юзера',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Device'
              }
            },
          },
        },
      },
    },
  }

  const definitions = {
    User: {
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
    },
    Device: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
        },
        token: {
          type: 'string',
        },
        type: {
          type: 'string',
        }
      },
    }
  }

  return { paths, definitions, parameters }
}
