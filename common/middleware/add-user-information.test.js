// Local dependencies
const addUserInformation = require('./add-user-information')

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
    addUserInformation(req, {}, done)
    expect(req.session['X-Auth-Name']).toEqual('John')
  })
})
