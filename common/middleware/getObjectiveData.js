const { logger } = require('../logging/logger')
const {
  getSentencePlanObjective,
  getSentencePlanNeeds,
  getMotivations,
  getInterventions,
} = require('../data/sentencePlanningApi')
const { catchAndReThrowError, getYearMonthFromDate, getStatusText, RESPONSIBLE_LIST } = require('../utils/util')

const getObjectiveData = async (req, res, next) => {
  try {
    const {
      errors,
      errorSummary,
      params: { planId, objectiveId },
      headers: { 'x-auth-token': token },
      renderInfo,
    } = req
    const objective = await getSentencePlanObjective(planId, objectiveId, token).catch(error =>
      catchAndReThrowError(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}`, error)
    )
    const motivations = await getMotivations(token).catch(error =>
      catchAndReThrowError(`Could not retrieve motivation list`, error)
    )
    // only get needs data if there is an action with needs
    if (objective.needs && objective.needs.length > 0) {
      const needs = await getSentencePlanNeeds(planId, token).catch(error =>
        catchAndReThrowError(`Could not retrieve needs for sentence plan ${planId}`, error)
      )
      objective.needs = objective.needs.map(need => needs.find(({ id }) => id === need).name)
    }
    // only get intervention data if there is an action with an intervention
    const hasInterventions = !objective.actions.every(({ intervention }) => !intervention)
    let interventions = []
    if (hasInterventions) {
      interventions = await getInterventions(token).catch(error =>
        catchAndReThrowError(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}`, error)
      )
    }
    objective.actions = objective.actions.map(action => {
      const { id, description, intervention, motivationUUID, owner, ownerOther, targetDate, status } = action
      const interventionText =
        intervention && `Intervention: ${interventions.find(({ uuid }) => uuid === intervention).shortDescription}`
      const { monthName, year } = getYearMonthFromDate(targetDate)
      const ownerText = owner
        .map(ownerType => RESPONSIBLE_LIST.find(({ value }) => value === ownerType).text)
        .join(', ')
      const ownerOtherText = ownerOther ? `: ${ownerOther}` : ''
      return {
        id,
        description: interventionText || description,
        motivation: motivations.find(({ uuid }) => uuid === motivationUUID).motivationText,
        targetDate: `${monthName} ${year}`,
        owner: `${ownerText}${ownerOtherText}`,
        status: getStatusText(status),
      }
    })

    req.renderInfo = {
      ...renderInfo,
      errors,
      errorSummary,
      objective,
    }
    return next()
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to retrieve your objective. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getObjectiveData }
