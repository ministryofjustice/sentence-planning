const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const errorList = errors.array().reduce((obj, item) => {
    const arrayObj = obj
    arrayObj[item.param] = { text: item.msg }
    return arrayObj
  }, {})

  const errorSummary = []
  errors.array().map(err => {
    return errorSummary.push({ text: err.msg, href: `#${err.param}-error` })
  })

  req.errors = errorList
  req.errorSummary = errorSummary

  return next()
}

module.exports = { validate }
