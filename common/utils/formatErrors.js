const BLANK_ERROR = 'BLANK_ERROR'
const removeBlankErrors = errors => (Array.isArray(errors) ? errors.filter(({ msg }) => msg !== BLANK_ERROR) : errors)
const formatErrors = errors => {
  return errors.reduce((obj, item) => {
    const arrayObj = obj
    arrayObj[item.param] = { text: item.msg }
    return arrayObj
  }, {})
}
const formatErrorSummary = errors => {
  return errors.map(({ msg, param }) => ({ text: msg, href: `#${param}-error` }))
}
module.exports = { BLANK_ERROR, removeBlankErrors, formatErrors, formatErrorSummary }
