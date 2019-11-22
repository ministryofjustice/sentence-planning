const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  // make template ready errors object
  const newErrors = errors.array().reduce((obj, itm) => {
    obj[itm.param] = { text: itm.msg }
    return obj
  }, {})

  const errorSummary = []
  errors.array().map(err => {
    errorSummary.push({ text: err.msg, href: `#${err.param}-error` })
  })

  req.errors = newErrors
  req.errorSummary = errorSummary

  console.log('errorSummary')
  console.log(errorSummary)

  return next()
}

// function validate(path) {
//   return (req, res, next) => {
//     const validationRules = require(`${path}/validation`).validation
//     validationRules(req)
//
//     console.log(validationRules)
//
//     console.log(`Inside mycache:${path}`)
//     const errors = validationResult(req)
//     console.log(errors)
//     if (errors.isEmpty()) {
//       next()
//     }
//     const extractedErrors = []
//     errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
//     req.errors = errors
//
//     next()
//   }
// }

module.exports = { validate }
