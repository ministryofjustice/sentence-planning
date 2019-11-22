const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  // make template ready errors object
  const newErrors = errors.array().reduce((obj, itm) => {
    // eslint-disable-next-line no-param-reassign
    obj[itm.param] = { text: itm.msg }
    return obj
  }, {})

  const errorSummary = []
  errors.array().map(err => {
    return errorSummary.push({ text: err.msg, href: `#${err.param}-error` })
  })

  req.errors = newErrors
  req.errorSummary = errorSummary

  return next()
}

module.exports = { validate }
