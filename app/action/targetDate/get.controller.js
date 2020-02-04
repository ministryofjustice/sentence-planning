const { getYearMonthFromDate } = require('../../../common/utils/util')

const getTargetDate = ({ targetDate }, body = {}) => {
  let { 'target-date-Month': targetDateMonth = '', 'target-date-Year': targetDateYear = '' } = body
  if (!targetDateMonth && !targetDateYear && targetDate) {
    const { month, year } = getYearMonthFromDate(targetDate)
    targetDateMonth = month.toString()
    targetDateYear = year
  }
  return { targetDateMonth, targetDateYear }
}

module.exports = { getTargetDate }
