// Local dependencies
const addUserInformation = require('./add-user-information')

describe('Put keycloak header information into session', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      session: {
        'X-Auth-Name': 'James',
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

  test('should throw an error if "X-Auth-Name" is not in session', () => {
    req.session = {}
    expect(() => {
      addUserInformation(req, res, () => {})
    }).toThrowError('Username (X-Auth-Name) not found in session')
  })
})
