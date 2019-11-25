const formatErrorSummary = errors => {
  const errorSummary = []
  errors.array().map(err => {
    return errorSummary.push({ text: err.msg, href: `#${err.param}-error` })
  })
  return errorSummary
}

module.exports = { formatErrorSummary }
