// Local dependencies
const storeOasysSessionKey = require('./storeOasysSessionKey')

describe('Put OASys session key information into session', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      query: {
        sessionKey: '',
      },
      session: {
        sessionKey: '',
      },
    }
  })

  test('should store the key in session', done => {
    req.query.sessionKey = '1234'
    storeOasysSessionKey(req, res, done)
    expect(req.session.sessionKey).toEqual('1234')
  })
  test('should overwrite the key in session', done => {
    req.query.sessionKey = '1234'
    req.session.sessionKey = '4321'
    storeOasysSessionKey(req, res, done)
    expect(req.session.sessionKey).toEqual('1234')
  })
  test('should not overwrite the key in session if query value is not present', done => {
    req.query.sessionKey = undefined
    req.session.sessionKey = '4321'
    storeOasysSessionKey(req, res, done)
    expect(req.session.sessionKey).toEqual('4321')
  })
})
