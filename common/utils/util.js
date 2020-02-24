const { logger } = require('../logging/logger')
const { ACTION_STATUS_TYPES, ACTION_RESPONSIBLE_TYPES } = require('./constants')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const STATUS_LIST = [
  { simplifiedText: 'Not started', text: 'To do', value: ACTION_STATUS_TYPES.NOT_STARTED, initialStatus: true },
  { simplifiedText: 'Doing it', text: 'In progress', value: ACTION_STATUS_TYPES.IN_PROGRESS, initialStatus: true },
  { simplifiedText: 'Paused', text: 'Paused', value: ACTION_STATUS_TYPES.PAUSED },
  { simplifiedText: 'Finished', text: 'Completed', value: ACTION_STATUS_TYPES.COMPLETED },
  { simplifiedText: 'Did some', text: 'Partially completed', value: ACTION_STATUS_TYPES.PARTIALLY_COMPLETED },
  { simplifiedText: 'Stopped', text: 'Abandoned', value: ACTION_STATUS_TYPES.ABANDONED },
]

const RESPONSIBLE_LIST = [
  { text: 'Individual', value: ACTION_RESPONSIBLE_TYPES.SERVICE_USER },
  { text: 'Offender manager', value: ACTION_RESPONSIBLE_TYPES.PRACTITIONER },
  { text: 'Other', value: ACTION_RESPONSIBLE_TYPES.OTHER },
]

const getStatusText = status => STATUS_LIST.find(({ value }) => status === value).text
const getSimplifiedStatusText = status => STATUS_LIST.find(({ value }) => status === value).simplifiedText

const getYearMonthFromDate = dateString => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const monthName = date.toLocaleString('default', { month: 'long' })
  return { month, monthName, year: date.getFullYear().toString() }
}

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

const sortObject = (key, order = 'asc') => {
  return function innerSort(a, b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}

const groupBy = (list, keyGetter) => {
  const sortedObject = {}
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = sortedObject[key]
    if (!collection) {
      sortedObject[key] = [item]
    } else {
      collection.push(item)
    }
  })
  return sortedObject
}

const catchAndReThrowError = (msg, error) => {
  const newError = new Error(`${msg} ${error}`)
  logger.error(newError)
  throw newError
}

const isValidDate = (day, month, year) => {
  try {
    const date = new Date()
    date.setFullYear(year, month - 1, day)

    return (
      date.getFullYear() === parseInt(year, 10) &&
      date.getMonth() === parseInt(month, 10) - 1 &&
      date.getDate() === parseInt(day, 10)
    )
  } catch (error) {
    logger.error(`Valid date check error for day:${day}, month:${month}, year:${year}, error: ${error}`)
    return false
  }
}

module.exports = {
  getStatusText,
  getSimplifiedStatusText,
  getYearMonthFromDate,
  isEmptyObject,
  countWords,
  removeUrlLevels,
  sortObject,
  groupBy,
  isValidDate,
  catchAndReThrowError,
  UUID_REGEX,
  STATUS_LIST,
  RESPONSIBLE_LIST,
}
