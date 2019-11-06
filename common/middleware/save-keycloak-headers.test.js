// Local dependencies
const extractKeycloakHeaders = require('./save-keycloak-headers').saveKeycloakHeaders

describe('Put keycloak header information into session', () => {
  let req
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-username': 'John',
      },
      session: {},
    }
  })

  test('should add header if present', done => {
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['x-auth-username']).toEqual('John')
  })

  test('should overwrite existing value', done => {
    req.headers['x-auth-username'] = 'Paul'
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['x-auth-username']).toEqual('Paul')
  })

  test('should not set in session when header not present in request', done => {
    extractKeycloakHeaders(req, {}, done)
    expect(req.session['x-auth-userid']).toBeUndefined()
  })
})
