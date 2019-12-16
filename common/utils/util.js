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
  return !levels
    ? url
    : url
        .split('/')
        .slice(0, -levels)
        .join('/')
}

module.exports = { isEmptyObject, countWords, removeUrlLevels }
