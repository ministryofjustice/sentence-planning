// Local dependencies
const extractKeycloakHeaders = require('./save-keycloak-headers').saveKeycloakHeaders

describe('Put keycloak header information into session', () => {
  let req
  beforeEach(() => {
    req = {
      headers: {
        'X-Auth-Name': 'John',
      },
      session: {},
    }
  })

  test('should add header if present', done => {
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['X-Auth-Name']).toEqual('John')
  })

  test('should overwrite existing value', done => {
    req.headers['X-Auth-Name'] = 'Paul'
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['X-Auth-Name']).toEqual('Paul')
  })

  test('should not set in session when header not present in request', done => {
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['X-Auth-Username']).toBeUndefined()
  })
})
