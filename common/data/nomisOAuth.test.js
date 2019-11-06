const nock = require('nock')
const config = require('../config')
const getToken = require('./nomisOAuth')

describe('nomisOAuth', () => {
  let fakeNomis

  const token = 'token-1'

  beforeEach(() => {
    fakeNomis = nock(config.apis.oauth2.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getToken', () => {
    it('should return token from api', async () => {
      const expectedBody = 'grant_type=client_credentials'
      fakeNomis.post('/oauth/token', expectedBody).reply(200, { access_token: token })
      const output = await getToken()
      expect(output).toEqual(token)
    })
    it('should return null if an error is encountered', async () => {
      const expectedBody = 'grant_type=client_credentials'
      fakeNomis.post('/oauth/token', expectedBody).reply(403)
      const output = await getToken()
      expect(output).toEqual(null)
    })
  })
})
