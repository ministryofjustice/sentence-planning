const getTargetDate = ({ progress: [{ targetDate = '' } = {}] = [] }, body = {}) => {
  let { 'target-date-Month': targetDateMonth = '', 'target-date-Year': targetDateYear = '' } = body
  if (!targetDateMonth && !targetDateYear && targetDate) {
    const date = new Date(targetDate)
    targetDateMonth = (date.getMonth() + 1).toString()
    targetDateYear = date.getFullYear().toString()
  }
  return { targetDateMonth, targetDateYear }
}

module.exports = { getTargetDate }
