const { logger } = require('../../common/logging/logger')
const {
  getSentencePlanObjective,
  getSentencePlanNeeds,
  getMotivations,
  getInterventions,
} = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels, getYearMonthFromDate, getStatusText, RESPONSIBLE_LIST } = require('../../common/utils/util')

const catchAndReThrowError = (msg, error, res) => {
  const newError = new Error(`${msg} ${error}`)
  logger.error(newError)
  throw newError
}

const getObjectiveReview = async (req, res) => {
  try {
    const {
      path,
      errors,
      errorSummary,
      params: { planId, objectiveId },
      headers: { 'x-auth-token': token },
    } = req
    const nexturl = path.substring(0, path.lastIndexOf('/'))
    const backurl = removeUrlLevels(path, 3)
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

    const renderDetails = {
      nexturl,
      backurl,
      errors,
      errorSummary,
      objective,
    }
    return res.render(`${__dirname}/index`, renderDetails)
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to review your objective. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getObjectiveReview }
