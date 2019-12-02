const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')
const { isEmptyObject } = require('../../common/utils/util')

const getPlan = plans => {
  if (isEmptyObject(plans)) return {}
  const [thePlan] = plans.filter(plan => plan.completedDate === '' || plan.completedDate === undefined)

  return thePlan || {}
}

const sentencePlanSummary = async ({ params: { id }, session: { 'x-auth-token': token } }, res) => {
  const plans = await getSentencePlanSummary(id, token)
  const renderInfo = {}
  renderInfo.individualId = id
  renderInfo.currentPlan = getPlan(plans)
  if (isEmptyObject(renderInfo.currentPlan)) {
    renderInfo.planType = 'none'
  } else if (renderInfo.currentPlan.isDraft) {
    renderInfo.planType = 'draft'
  } else {
    renderInfo.planType = 'active'
  }

  res.render(`${__dirname}/index`, renderInfo)
}

module.exports = { sentencePlanSummary }
