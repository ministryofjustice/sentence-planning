const { validationResult } = require('express-validator')
const { validate } = require('./validator')
const { formatErrors, formatErrorSummary } = require('../utils/formatErrors')

jest.mock('../utils/formatErrors')
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}))

describe('should carry out validation and set appropriate req values', () => {
  const req = {}
  const res = {}
  const next = jest.fn()

  afterEach(() => {
    validationResult.mockReset()
    formatErrors.mockReset()
    formatErrorSummary.mockReset()
    next.mockReset()
  })

  it('should set req values when errors are found', () => {
    validationResult.mockImplementation(() => {
      return {
        errors: [
          {
            value: '',
            msg: 'Error message',
            param: 'diversity',
            location: 'body',
          },
        ],
      }
    })
    validate(req, res, next)
    expect(validationResult).toHaveBeenCalled()
    expect(formatErrors).toHaveBeenCalled()
    expect(formatErrorSummary).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
  it('should just call next when there are no errors', () => {
    validationResult.mockImplementation(() => {
      return {}
    })
    validate(req, res, next)
    expect(validationResult).toHaveBeenCalled()
    expect(formatErrors).not.toHaveBeenCalled()
    expect(formatErrorSummary).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
