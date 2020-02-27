const { logger } = require('../../common/logging/logger')
const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')
const { isEmptyObject } = require('../../common/utils/util')

const getPlan = (plans = {}) => {
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

const getPlanType = (plan = {}) => {
  let planType = 'active'
  if (isEmptyObject(plan)) {
    planType = 'none'
  } else if (plan.draft) {
    planType = 'draft'
  }
  return planType
}

const sentencePlanSummary = async ({ tokens, params: { id } }, res) => {
  try {
    const plans = await getSentencePlanSummary(id, tokens)
    const currentPlan = getPlan(plans)

    res.render(`${__dirname}/index`, {
      individualId: id,
      currentPlan,
      planType: getPlanType(currentPlan),
      completedPlans: getCompletedPlans(plans),
    })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan summary for ${id}, error: ${error}`)
    res.render('app/error', { error })
  }
}

module.exports = { sentencePlanSummary, getPlan, getCompletedPlans, getPlanType }
