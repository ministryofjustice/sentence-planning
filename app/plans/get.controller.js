const { getSentencePlanSummary } = require('../../common/data/offenderSentencePlanSummary')
const { isEmptyObject } = require('../../common/utils/util')

const hasActivePlan = plans => {
  if (isEmptyObject(plans)) return false
  let activePlanPresent = false
  plans.forEach(plan => {
    if (!plan.completedDate) {
      activePlanPresent = true
    }
  })
  return activePlanPresent
}

const sentencePlanSummary = async ({ params: { id }, session: { 'x-auth-token': token } }, res) => {
  const plans = await getSentencePlanSummary(id, token)
  const renderInfo = {}
  if (!plans || isEmptyObject(plans)) {
    renderInfo.activePlan = false
  } else {
    renderInfo.activePlan = hasActivePlan(plans)
  }
  renderInfo.individualId = id
  res.render(`${__dirname}/index`, renderInfo)
}

module.exports = { sentencePlanSummary, hasActivePlan }
