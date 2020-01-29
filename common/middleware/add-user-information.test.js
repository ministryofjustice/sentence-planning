// Local dependencies
const addUserInformation = require('./add-user-information')

describe('Put keycloak header information into session', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-name': 'James',
      },
    }
    res = {
      locals: {},
    }
  })

  test('should add user name to locals', done => {
    addUserInformation(req, res, done)
    expect(res.locals.username).toEqual('James')
  })

  test('should throw an error if "x-auth-name" is not in session', () => {
    req.headers = {}
    expect(() => {
      addUserInformation(req, res, () => {})
    }).toThrowError('Username (x-auth-name) not found in session')
  })
})
