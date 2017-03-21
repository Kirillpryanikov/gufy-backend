export default function getDocsMethods() {
  return {
    getPropertiesFromScheme: function(scheme) {
      const allowTypes = ['string', 'number', 'date']
      const properties = {}
      Object.keys(scheme.paths).forEach((key) => {
        const _property = scheme.paths[key]
        const property = {}
        property.type = _property.instance.toLowerCase()
        if (allowTypes.indexOf(property.type) !== -1) {
          properties[_property.path] = property
        }
      })
      return properties
    },
    getPropertiesFromParams: function(params) {
      const properties = {}
      params.forEach(param => {
        const property = {
          type: param.type
        }
        if (param.type === 'array' && param.items) {
          property.items = param.items
        }
        properties[param.name] = property
      })
      return properties
    }
  }
}
