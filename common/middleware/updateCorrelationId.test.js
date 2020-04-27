// Local dependencies
const cls = require('cls-hooked')
const { updateCorrelationId } = require('./updateCorrelationId')
const { updateMDC } = require('../utils/util.js')

jest.mock('../utils/util.js', () => ({
  updateMDC: jest.fn(),
}))

jest.mock('cls-hooked')

describe('Set correlation ID to value of x-request-id if it is present', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-token': 'THX1138',
      },
    }
    cls.getNamespace.mockImplementation(() => ({
      get: jest.fn(() => {
        return { correlationId: 'existingId' }
      }),
      set: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should not change correlation ID', done => {
    updateCorrelationId(req, res, done)
    expect(cls.getNamespace).not.toHaveBeenCalled()
  })

  test('should update correlation ID', done => {
    req.headers['x-request-id'] = 'NCC-1701'
    updateCorrelationId(req, res, done)
    expect(cls.getNamespace).toHaveBeenCalled()
    expect(updateMDC).toHaveBeenCalledWith('MDC', { correlationId: 'NCC-1701' })
  })
})
