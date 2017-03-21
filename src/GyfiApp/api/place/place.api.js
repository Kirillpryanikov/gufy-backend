import _ from 'lodash'
import restling from 'restling'
const clientId = 'GVXLP5ATUI2VAMBIYRBA15QWCTFKS2FD3Q4JU02DPHIZTW51'
const clientSecret = '0REDFUUZJCM2DKHEJOCGMKXNXAQSANMBXPBLVS24QPUZSKXR'

export default() => {
  return {
    api: 'https://api.foursquare.com/v2/venues',
    get: async function get(id) {
      let url = this.api + '/' + id
      url += `?client_id=${clientId}&client_secret=${clientSecret}`
      const date = new Date()
      let month = date.getMonth()
      if (month < 10) month = '0' + month
      url += `&v=${date.getFullYear()}${month}${date.getDate()}`
      const data = await restling.get(url)
      let venue = null
      if (data && data.data && data.data.response && data.data.response.venue) {
        const _venue = data.data.response.venue
        venue = {
          id : _venue.id,
          name: _venue.name,
          address: _venue.location.address,
          lat: _venue.location.lat,
          lng: _venue.location.lng,
        }
      }
      return venue
    },
    search: async function(params) {
      const {lat, lng, search} = params
      let url = this.api
      url += `/search?client_id=${clientId}&client_secret=${clientSecret}`
      if (lat && lng) url += '&ll=' + lat + ',' + lng
      if (search) url += '&search=' + search
      const date = new Date()
      let month = date.getMonth()
      if (month < 10) month = '0' + month
      url += `&v=${date.getFullYear()}${month}${date.getDate()}`
      const data = await restling.get(url)
      let venues = []
      console.log(data.data)
      if (data && data.data && data.data.response && data.data.response.venues) {
        venues = data.data.response.venues
      }
      venues = venues.map(function(venue) {
        return {
          id : venue.id,
          name: venue.name,
          address: venue.location.address,
          lat: venue.location.lat,
          lng: venue.location.lng,
        }
      })
      console.log(venues)
      return venues
    }
  }
}
