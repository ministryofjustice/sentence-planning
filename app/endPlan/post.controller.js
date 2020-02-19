const { logger } = require('../../common/logging/logger')
const { endSentencePlan } = require('../../common/data/sentencePlanningApi')

const postEndPlan = async ({ params: { planId, id }, tokens }, res) => {
  try {
    await endSentencePlan(planId, tokens)
    return res.redirect(`/individual-id/${id}/plans`)
  } catch (error) {
    logger.error(`Could not end sentence plan ${planId} for individual ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postEndPlan }
