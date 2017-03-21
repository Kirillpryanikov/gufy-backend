export default function getDocs(ctx, params) {
  return Object.assign(require('./api.docs.json'), params)
}
