const { getInterventions } = require('../../../common/data/sentencePlanningApi')
const { logger } = require('../../../common/logging/logger')

const getActionDescriptionIntervention = async (
  { intervention: actionIntervention = '', description: actionDescription = '' },
  { actionType = '', intervention: bodyIntervention = '', description: bodyDescription = '' },
  token
) => {
  try {
    const interventions = await getInterventions(token)
    let intervention = actionIntervention
    let description = actionDescription
    let interventionChecked = !!actionIntervention
    let descriptionChecked = !!actionDescription

    if (actionType) {
      if (actionType === 'intervention') {
        interventionChecked = true
        descriptionChecked = false
        intervention = bodyIntervention
        description = ''
      } else {
        interventionChecked = false
        descriptionChecked = true
        intervention = ''
        description = bodyDescription
      }
    }

    const interventionList = interventions.map(({ shortDescription: text, uuid: value }) => ({
      text,
      value,
      selected: intervention === value,
    }))
    return {
      interventionList,
      interventionId: 'intervention',
      interventionLabel: 'What intervention are they going to take?',
      description,
      intervention,
      interventionChecked,
      descriptionChecked,
    }
  } catch (error) {
    logger.error(`Could not retrieve intervention list`)
    throw error
  }
}

module.exports = { getActionDescriptionIntervention }
