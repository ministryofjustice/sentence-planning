const { validationResult } = require('express-validator')
const { removeBlankErrors, formatErrors, formatErrorSummary } = require('../utils/formatErrors')
const { isEmptyObject } = require('../utils/util')

const validate = (req, res, next) => {
  const { errors } = validationResult(req)
  if (isEmptyObject(errors)) {
    return next()
  }
  const filteredErrors = removeBlankErrors(errors)
  req.errors = formatErrors(filteredErrors)
  req.errorSummary = formatErrorSummary(filteredErrors)

  return next()
}

module.exports = { validate }
