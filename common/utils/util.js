const isEmptyObject = obj => {
  if (obj === undefined || obj === null) return true
  return !Object.keys(obj).length
}

const countWords = str => {
  return str
    .replace(/-/gi, ' ')
    .trim()
    .split(/\s+/).length
}

const removeUrlLevels = (url, levels) => {
  let newUrl = url
  for (let i = 0; i < levels; i += 1) {
    newUrl = newUrl.substring(0, newUrl.lastIndexOf('/'))
  }
  return newUrl
}

module.exports = { isEmptyObject, countWords, removeUrlLevels }
