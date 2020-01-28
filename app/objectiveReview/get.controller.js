const { logger } = require('../../common/logging/logger')
const {
  getSentencePlanObjective,
  getSentencePlanNeeds,
  getMotivations,
  getInterventions,
} = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels, getYearMonthFromDate, getStatusText, RESPONSIBLE_LIST } = require('../../common/utils/util')

const renderError = (msg, error, res) => {
  logger.error(`${msg}, error: ${error}`)
  return res.render('app/error', { error })
}

const getObjectiveReview = async (req, res) => {
  const {
    path,
    errors,
    errorSummary,
    params: { planId, objectiveId },
    session: { 'x-auth-token': token },
  } = req
  const nexturl = path.substring(0, path.lastIndexOf('/'))
  const backurl = removeUrlLevels(path, 3)
  const objective = await getSentencePlanObjective(planId, objectiveId, token).catch(error =>
    renderError(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}`, error, res)
  )
  const motivations = await getMotivations(token).catch(error =>
    renderError(`Could not retrieve motivation list`, error, res)
  )

  // only get needs data if there is an action with needs
  if (objective.needs && objective.needs.length > 0) {
    const needs = await getSentencePlanNeeds(planId, token).catch(error =>
      renderError(`Could not retrieve needs for sentence plan ${planId}`, error, res)
    )
    objective.needs = objective.needs.map(need => needs.find(({ id }) => id === need).name)
  }

  // only get intervention data if there is an action with an intervention
  const hasInterventions = !objective.actions.every(({ intervention }) => !intervention)
  let interventions = []
  if (hasInterventions) {
    interventions = await getInterventions(token).catch(error =>
      renderError(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}`, error, res)
    )
  }
  objective.actions = objective.actions.map(action => {
    const {
      description,
      intervention,
      motivationUUID,
      owner,
      ownerOther,
      progress: [{ targetDate, status }],
    } = action
    const interventionText =
      intervention && `Intervension: ${interventions.find(({ uuid }) => uuid === intervention).shortDescription}`
    const { monthName, year } = getYearMonthFromDate(targetDate)
    const ownerText = owner.map(ownerType => RESPONSIBLE_LIST.find(({ value }) => value === ownerType).text).join(', ')
    const ownerOtherText = ownerOther ? `: ${ownerOther}` : ''
    return {
      description: interventionText || description,
      motivation: motivations.find(({ uuid }) => uuid === motivationUUID).friendlyText,
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
}

module.exports = { getObjectiveReview }
