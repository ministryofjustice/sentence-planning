const { logger } = require('../../common/logging/logger')
const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')
const { isEmptyObject } = require('../../common/utils/util')

const getPlan = plans => {
  if (isEmptyObject(plans)) return {}
  return (
    plans.find(({ completedDate }) => completedDate === '' || completedDate === undefined || completedDate === null) ||
    {}
  )
}

const getCompletedPlans = plans => {
  if (isEmptyObject(plans)) return {}
  return plans.filter(
    ({ completedDate }) => completedDate !== '' && completedDate !== undefined && completedDate !== null
  )
}

const sentencePlanSummary = async ({ tokens, params: { id } }, res) => {
  try {
    const plans = await getSentencePlanSummary(id, tokens)
    const renderInfo = {}
    renderInfo.individualId = id
    renderInfo.currentPlan = getPlan(plans)
    renderInfo.planType = 'active'
    if (isEmptyObject(renderInfo.currentPlan)) {
      renderInfo.planType = 'none'
    } else if (renderInfo.currentPlan.draft) {
      renderInfo.planType = 'draft'
    }

    res.render(`${__dirname}/index`, { renderInfo, completedPlans: getCompletedPlans(plans) })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan summary for ${id}, error: ${error}`)
    res.render('app/error', { error })
  }
}

module.exports = { sentencePlanSummary }
