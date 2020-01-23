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

    // if each section has a completed item, do not disable the 'start plan' button
    const disableStartButton = !planSummary.sections.reduce((planCanBeStarted, section) => {
      if (planCanBeStarted === false) return planCanBeStarted

      return section.items.some(sectionItem => {
        return sectionItem.complete === true
      })
    }, '')

    res.render(`${__dirname}/index`, { planId, id, token, planSummary, disableStartButton })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan for ${id}, error: ${error}`)
    res.render('app/error', { error })
  }
}

module.exports = { editPlan, getAboutTheIndividual, getAddObjectives, getFinalInformation }
