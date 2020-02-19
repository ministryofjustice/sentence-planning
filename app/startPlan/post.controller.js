const { logger } = require('../../common/logging/logger')
const { startSentencePlan } = require('../../common/data/sentencePlanningApi')

const postStartPlan = async (req, res) => {
  const {
    params: { planId, id },
    tokens,
  } = req
  try {
    await startSentencePlan(planId, tokens)
    req.session.planStarted = true
    return res.redirect(`/individual-id/${id}/plan/${planId}`)
  } catch (error) {
    logger.error(`Could not start sentence plan ${planId} for individual ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postStartPlan }
