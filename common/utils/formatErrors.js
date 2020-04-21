const BLANK_ERROR = 'BLANK_ERROR'
const removeBlankErrors = errors => (Array.isArray(errors) ? errors.filter(({ msg }) => msg !== BLANK_ERROR) : errors)
const formatErrors = errors => {
  return errors.reduce((obj, { param, msg, location }) => {
    const arrayObj = obj
    if (param) arrayObj[param] = { text: msg }
    else if (arrayObj[location]) arrayObj[location].text += `. ${msg}`
    else arrayObj[location] = { text: msg }
    return arrayObj
  }, {})
}
const formatErrorSummary = errors => {
  return errors.map(({ msg, param }) => ({ text: msg, href: `#${param}-error` }))
}
module.exports = { BLANK_ERROR, removeBlankErrors, formatErrors, formatErrorSummary }
