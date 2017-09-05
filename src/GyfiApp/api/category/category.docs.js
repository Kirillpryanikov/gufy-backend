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
      name:'image',
      in:'query',
      description: 'Ссылка на картинку',
      required: false,
      type: 'string',
    },
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const properties = {}

  const paths = {
    '/category': {
      'get': {
        'summary': 'Получить список всех категорий',
        'tags': ['category'],
        'responses': {
          '200': {
            'description': 'Массив категорий',
            'schema': {
              'type': 'array',
              'items':{
                '$ref': '#/definitions/Category'
              }
            }
          }
        }
      },
      'post':{
        'summary': 'Создать новую категорию',
        'tags': ['category'],
        'parameters':parameters,
        'responses': {
          '200': {
            'description': 'Категория',
            'schema': {
              '$ref': '#/definitions/Category'
            }
          }
        }
      }
    },
    '/category/{id}': {
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
        'summary': 'Найти категорию по ID',
        'tags': ['category'],
        'parameters': '?page=/number page/  Receive limit - 20',
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Сategory'
            }
          }
        }
      },
      'put': {
        'summary': 'Изменить категорию',
        'tags': ['category'],
        'parameters': putParameters,
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Category'
            }
          }
        }
      },
      'delete': {
        'summary': 'Удалить категорию',
        'tags': ['category'],
        'responses': {
          '200': {
            'description': 'Товар',
            'schema': {
              '$ref': '#/definitions/Category'
            }
          }
        }
      },
    },
    '/category/{id}/products': {
      'parameters':[
        {
          'name': 'id',
          'in': 'path',
          'description':'id категории',
          'required': true,
          'type': 'string',
        },
      ],
      'get': {
        'summary': 'Найти все продукты в этой категории',
        'tags': ['product', 'category'],
        'responses': {
          '200': {
            'description': 'Товары',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Product'
              }
            }
          }
        }
      },
    },
  }

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
