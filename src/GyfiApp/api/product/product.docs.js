/* eslint-disable */
import getDocsMethods from '../_docs'
import _ from 'lodash'
const { getPropertiesFromParams } = getDocsMethods()

export default(ctx, parent) => {

  const parameters = [
    {
      name:'title',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'price',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'categoryId',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'status',
      in:'query',
      description: '',
      required: false,
      type: 'number',
    },
    {
      name:'images',
      in:'formData',
      description: '',
      required: false,
      type: 'array',
      items: {
        type: 'string',
      }
    },
    {
      name:'description',
      in:'query',
      description: '',
      required: true,
      type: 'string',
    },
    {
      name:'vipTime',
      in:'query',
      description: 'До какого времени товар будет премиумным',
      required: false,
      type: 'string',
      format: 'date',
    },
    {
      name:'vip',
      in:'query',
      description: 'Премиумный ли товар',
      required: false,
      type: 'boolean',
    },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })
  putParameters.push(
    {
      name:'ownerId',
      in:'query',
      description: '',
      required: false,
      type: 'string',
    },
  )
  putParameters.push(
    {
      name:'buyerId',
      in:'query',
      description: '',
      required: false,
      type: 'string',
    },
  )

  const properties = {}

  const paths = {
    '/product': {
      'get': {
        'summary': 'Получить список всех товаров',
        'tags': ['product'],
        'responses': {
          '200': {
            'description': 'Массив товаров',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/Product'
              }
            }
          }
        }
      },
      'post':{
        'summary': 'Создать новый товар',
        'tags': ['product'],
        'parameters':parameters,
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Product'
            }
          }
        }
      }
    },
    '/product/{id}': {
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
        'summary': 'Найти товар по ID',
        'tags': ['product'],
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Product'
            }
          }
        }
      },
      'put': {
        'summary': 'Изменить товар',
        'tags': ['product'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Product'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить товар',
        'tags': ['product'],
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Product'
            }
          }
        }
      },
    },
    '/product/{id}/buy': {
      'parameters':[
        {
          'name': 'id',
          'in': 'path',
          'description':'id',
          'required': true,
          'type': 'string',
        },
      ],
      'post': {
        'summary': 'Купить товар',
        'tags': ['product'],
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Product'
            }
          }
        }
      },
    },
    '/product/{id}/extend-time': {
      'parameters':[
        {
          'name': 'id',
          'in': 'path',
          'description':'id',
          'required': true,
          'type': 'string',
        },
        {
          'name': 'hours',
          'in': 'path',
          'description':'count hours',
          'required': true,
          'type': 'number',
        }
      ],
      'put': {
        'summary': 'Продлить Vip Time для продукта',
        'tags': ['product'],
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Product'
            }
          }
        }
      },
    }
  }

  const definitions = {
    Product: {
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
