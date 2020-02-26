const { logger } = require('../logging/logger')
const {
  ACTION_STATUS_TYPES: { COMPLETED, PARTIALLY_COMPLETED, NOT_STARTED, ABANDONED },
  STATUS_LIST,
  RESPONSIBLE_LIST,
} = require('./constants')

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

const hasClosedStatus = status => {
  const result = [COMPLETED, PARTIALLY_COMPLETED, ABANDONED].includes(status)
  return result
}

const getObjectiveType = objective => {
  // objectives default to active if not caught with the other rules below
  let type = 'active'
  if (objective.actions.every(({ status }) => status === NOT_STARTED)) {
    type = 'future'
  } else if (objective.actions.every(({ status }) => hasClosedStatus(status))) {
    type = 'closed'
  }
  return type
}

const formatObjectiveActionsForPrintDisplay = (actions, printoutSimple = false) => {
  return actions.map(action => {
    const { monthName, year } = getYearMonthFromDate(action.targetDate)
    const statusText = printoutSimple ? getSimplifiedStatusText(action.status) : getStatusText(action.status)
    return [
      { text: action.description },
      { text: `${monthName} ${year}`, format: 'numeric' },
      { text: statusText, format: 'numeric' },
    ]
  })
}

module.exports = {
  formatObjectiveActionsForPrintDisplay,
  getObjectiveType,
  hasClosedStatus,
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
  STATUS_LIST,
  RESPONSIBLE_LIST,
}
