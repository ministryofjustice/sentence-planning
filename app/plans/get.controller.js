const { logger } = require('../../common/logging/logger')
const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')
const { isEmptyObject } = require('../../common/utils/util')

const getPlan = plans => {
  if (isEmptyObject(plans)) return {}
  return plans.find(({ completedDate }) => completedDate === '' || completedDate === undefined) || {}
}

const sentencePlanSummary = async ({ params: { id }, session: { 'x-auth-token': token } }, res) => {
  try {
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
  } catch (error) {
    logger.error(`Could not retrieve sentence plan summary for ${id}, error: ${error}`)
    res.render('app/error', { error })
  }
}

module.exports = { sentencePlanSummary }
