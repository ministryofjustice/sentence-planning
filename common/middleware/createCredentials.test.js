// Local dependencies
const createCredentials = require('./createCredentials')

describe('Put keycloak header information and OASys session key into token object', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-token': 'THX1138',
      },
    }
  })

  test('should add authorisation token to tokens object', done => {
    createCredentials(req, res, done)
    expect(req.tokens).toEqual({ authorisationToken: 'THX1138' })
  })

  test('should set defaults if items are not present in headers or session', () => {
    req.headers = {}
    createCredentials(req, res, () => {})
    expect(req.tokens).toEqual({ authorisationToken: '' })
  })
})
