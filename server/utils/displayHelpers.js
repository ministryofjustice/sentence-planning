const getTimeStringFromISO8601 = iso8601String => {
  if (!/^\/d{4}-\/d{2}-\/d{2}$/.test(iso8601String)) Error('Incorrect date format')
  const theDate = new Date(iso8601String)
  const month = theDate.toLocaleDateString('en-GB', { month: 'short' })
  return `${theDate.getDate()} ${month} ${theDate.getFullYear()}`
}

module.exports = { getTimeStringFromISO8601 }
