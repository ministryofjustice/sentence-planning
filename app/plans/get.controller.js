const { logger } = require('../../common/logging/logger')
const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')
const { isEmptyObject } = require('../../common/utils/util')
const {
  PLAN_TYPES: { ACTIVE, DRAFT, NONE },
} = require('../../common/utils/constants')

const isValid = str => str !== '' && str !== undefined && str !== null

const getPlan = (plans = {}) => {
  if (isEmptyObject(plans)) return {}
  return plans.find(({ completedDate, legacy }) => !isValid(completedDate) && !legacy) || {}
}

const getCompletedPlans = plans => {
  if (isEmptyObject(plans)) return {}
  return plans.filter(({ completedDate, legacy }) => isValid(completedDate) || legacy)
}

const getPlanType = (plan = {}) => {
  let planType = ACTIVE
  if (isEmptyObject(plan)) {
    planType = NONE
  } else if (plan.draft) {
    planType = DRAFT
  }
  return planType
}

const sentencePlanSummary = async ({ tokens, params: { id } }, res) => {
  try {
    const plans = await getSentencePlanSummary(id, tokens)
    const currentPlan = getPlan(plans)

    console.log({
      individualId: id,
      currentPlan,
      planType: getPlanType(currentPlan),
      completedPlans: getCompletedPlans(plans),
    })

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
