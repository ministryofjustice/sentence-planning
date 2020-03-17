const { logger } = require('../../../common/logging/logger')
const { removeUrlLevels } = require('../../../common/utils/util')
const { getOasysSentencePlan } = require('../../../common/data/sentencePlanningApi')

const printLegacySentencePlan = async ({ path, params: { id, planId }, tokens }, res) => {
  try {
    const backUrl = `${removeUrlLevels(path, 2)}/plans`

    // get the OASys sentence plan
    const legacyPlan = await getOasysSentencePlan(id, planId, tokens)

    // convert the questions object in the plan to an array so nunjucks can sort it
    const { questions } = legacyPlan
    legacyPlan.questions = Object.keys(questions).map(key => {
      return questions[key]
    })

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
