const { validationResult } = require('express-validator')
const { formatErrors } = require('../utils/formatErrors')
const { formatErrorSummary } = require('../utils/formatErrorSummary')
const { isEmptyObject } = require('../utils/util')

const validate = (req, res, next) => {
  const { errors } = validationResult(req)
  if (isEmptyObject(errors)) {
    return next()
  }

  req.errors = formatErrors(errors)
  req.errorSummary = formatErrorSummary(errors)

  return next()
}

module.exports = { validate }
