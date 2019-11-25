const isEmptyObject = obj => {
  return !Object.keys(obj).length
}

const countWords = str => {
  return str.trim().split(/\s+/).length
}

module.exports = { isEmptyObject, countWords }
