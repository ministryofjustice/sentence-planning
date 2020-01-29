const { logger } = require('../../common/logging/logger')
const { endSentencePlan } = require('../../common/data/sentencePlanningApi')

const postEndPlan = async (req, res) => {
  const {
    params: { planId, id },
    headers: { 'x-auth-token': token },
  } = req
  try {
    await endSentencePlan(planId, token)
    return res.redirect(`/individual-id/${id}/plans`)
  } catch (error) {
    logger.error(`Could not end sentence plan ${planId} for individual ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postEndPlan }
