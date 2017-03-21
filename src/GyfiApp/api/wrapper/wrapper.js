import asyncRouter from 'lego-starter-kit/utils/AsyncRouter';
export default function (ctx, { model, api, ignore = [] }) {
  if (!api) {
    api = asyncRouter()
  }
  if (ignore.indexOf('get') === -1) {
    api.get('/', async () => {
      return model.findAll()
    })
  }
  if (ignore.indexOf('getById') === -1) {
    api.get('/:id', async (req) => model.findById(req.params.id))
  }
  if (ignore.indexOf('post') === -1) {
    api.post('/', async function(req) {
      const params = req.allParams()
      return model.create(params)
    })
  }
  if (ignore.indexOf('put') === -1) {
    api.put('/:id', async function(req) {
      const params = req.allParams()
      await model.update(params, {
        where: {
          id: req.params.id,
        },
      })
      return model.findById(req.params.id)
    })
  }
  if (ignore.indexOf('delete') === -1) {
    api.delete('/:id', async function(req) {
      const id = req.params.id
      const obj = await model.findById(id)
      if (!obj) return { n: 0 }
      await obj.destroy()
      return { deleted: obj, n: 1 }
    })
  }


  return api
}
