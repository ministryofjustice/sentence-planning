// Local dependencies
const extractKeycloakHeaders = require('./save-keycloak-headers').saveKeycloakHeaders

describe('Put keycloak header information into session', () => {
  let mockRequest
  beforeEach(() => {
    mockRequest = sessionData => {
      return {
        headers: {
          'X-Auth-Name': 'John',
        },
        session: { data: sessionData },
      }
    }
  })

  test('should add header if present', done => {
    const req = mockRequest()
    const res = {}
    extractKeycloakHeaders(req, res, done)
    expect(req.session['X-Auth-Name']).toEqual('John')
  })

  test('should overwrite existing value', done => {
    const req = mockRequest()
    req.headers['X-Auth-Name'] = 'Paul'
    const res = {}
    extractKeycloakHeaders(req, res, done)
    expect(req.session['X-Auth-Name']).toEqual('Paul')
  })

  test('should not set in session when header not present in request', done => {
    const req = mockRequest()
    const res = {}
    extractKeycloakHeaders(req, res, done)
    expect(req.session['X-Auth-Username']).toBeUndefined()
  })
})
