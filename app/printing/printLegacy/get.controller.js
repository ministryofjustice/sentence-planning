const { logger } = require('../../../common/logging/logger')
const { removeUrlLevels } = require('../../../common/utils/util')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const {
  COMMENT_TYPES: { YOUR_RESPONSIVITY, YOUR_SUMMARY, THEIR_RESPONSIVITY, THEIR_SUMMARY },
} = require('../../../common/utils/constants')

const printLegacySentencePlan = async ({ path, params: { id, planId }, tokens }, res) => {
  try {
    const backUrl = `${removeUrlLevels(path, 2)}/plans`

    let legacyPlan

    // get the sentence plan
    try {
      legacyPlan = await getSentencePlan(planId, tokens)
    } catch (error) {
      logger.error(`Could not retrieve OASys sentence plan ${planId} for offender ${id}, error: ${error}`)
      return res.render('app/error', { error })
    }

    return res.render(`${__dirname}/index`, {
      backUrl,
      legacyPlan,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to display the sentence plan. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { printLegacySentencePlan }
