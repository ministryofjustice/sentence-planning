const formatErrors = errors => {
  return errors.reduce((obj, item) => {
    const arrayObj = obj
    arrayObj[item.param] = { text: item.msg }
    return arrayObj
  }, {})
}

module.exports = { formatErrors }
