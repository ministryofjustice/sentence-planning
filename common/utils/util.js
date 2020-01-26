const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const STATUS_LIST = [
  { text: 'To do', value: 'NOT_STARTED' },
  { text: 'In progress', value: 'IN_PROGRESS' },
  { text: 'Paused', value: 'PAUSED' },
  { text: 'Completed', value: 'COMPLETED' },
  { text: 'Partially completed', value: 'PARTIALLY_COMPLETED' },
  { text: 'Abandoned', value: 'ABANDONED' },
]

const RESPONSIBLE_LIST = [
  { text: 'Individual', value: 'SERVICE_USER' },
  { text: 'Offender manager', value: 'PRACTITIONER' },
  { text: 'Other', value: 'OTHER' },
]

const getStatusText = status => STATUS_LIST.find(({ value }) => status === value).text

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

module.exports = {
  getStatusText,
  getYearMonthFromDate,
  isEmptyObject,
  countWords,
  removeUrlLevels,
  sortObject,
  UUID_REGEX,
  STATUS_LIST,
  RESPONSIBLE_LIST,
}
