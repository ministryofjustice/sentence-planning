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

  test('should add Test User name to locals if not in session', done => {
    req.session = {}
    addUserInformation(req, res, done)
    expect(res.locals.username).toEqual('Test User')
  })
})
