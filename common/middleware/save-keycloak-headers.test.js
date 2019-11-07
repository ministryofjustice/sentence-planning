// Local dependencies
const extractKeycloakHeaders = require('./save-keycloak-headers').saveKeycloakHeaders

describe('Put keycloak header information into session', () => {
  let req
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-name': 'John',
      },
      session: {},
    }
  })

  test('should add header if present', done => {
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['x-auth-name']).toEqual('John')
  })

  test('should overwrite existing value', done => {
    req.headers['x-auth-name'] = 'Paul'
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['x-auth-name']).toEqual('Paul')
  })

  test('should not set in session when header not present in request', done => {
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['x-auth-username']).toBeUndefined()
  })
})
