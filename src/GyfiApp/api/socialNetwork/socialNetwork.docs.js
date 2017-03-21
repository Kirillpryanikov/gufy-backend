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
  ]

  const putParameters = _.map(JSON.parse(JSON.stringify(parameters)), (param) => {
    if (param.name != 'id') param.required = false
    return param
  })

  const paths = {}

  const definitions = {
    Wall: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
      }
    }
  }

  return { paths, definitions }
}
