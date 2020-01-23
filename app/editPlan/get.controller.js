const { getSentencePlan } = require('../../common/data/sentencePlanningApi')
const { getAboutTheIndividual, getAddObjectives, getFinalInformation } = require('./getTaskListData')
const { logger } = require('../../common/logging/logger')

const editPlan = async ({ path, params: { id, planId }, session: { 'x-auth-token': token } }, res) => {
  try {
    const sentencePlan = await getSentencePlan(planId, token)
    const stub = path
    const objectivesSection = getAddObjectives(sentencePlan, stub)
    const planSummary = {
      sections: [
        getAboutTheIndividual(sentencePlan, stub),
        objectivesSection,
        getFinalInformation(sentencePlan, stub, objectivesSection.items[0].complete),
      ],
    }

    const disableStartButton = !planSummary.sections[2].items[0].complete

    res.render(`${__dirname}/index`, { planId, id, token, planSummary, disableStartButton })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan for ${id}, error: ${error}`)
    res.render('app/error', { error })
  }
}

module.exports = { editPlan, getAboutTheIndividual, getAddObjectives, getFinalInformation }
