const { logger } = require('../../../common/logging/logger')
const { removeUrlLevels } = require('../../../common/utils/util')

const printFullSentencePlan = async ({ path, params: { id, planId } }, res) => {
  try {
    const backUrl = removeUrlLevels(path, 1)
    res.render(`${__dirname}/index`, { backUrl })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan ${planId} print summary details for ${id}, error: ${error}`)
    res.render('app/error', { error })
  }
}

module.exports = { printFullSentencePlan }
