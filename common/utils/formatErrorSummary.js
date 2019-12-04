const formatErrorSummary = errors => {
  return errors.map(({ msg, param }) => ({ text: msg, href: `#${param}-error` }))
}

module.exports = { formatErrorSummary }
