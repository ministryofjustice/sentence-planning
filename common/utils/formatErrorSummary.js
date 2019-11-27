const formatErrorSummary = errors => {
  const errorSummary = []
  errors.map(err => {
    return errorSummary.push({ text: err.msg, href: `#${err.param}-error` })
  })
  return errorSummary
}

module.exports = { formatErrorSummary }
