const { logger } = require('../logging/logger')
const { getSentencePlanObjective, getSentencePlanNeeds, getInterventions } = require('../data/sentencePlanningApi')
const { getMotivation } = require('../../app/partials/motivations/get.controller')

const { catchAndReThrowError, getYearMonthFromDate, getStatusText, getActionText } = require('../utils/util')
const { RESPONSIBLE_LIST } = require('../utils/constants')

const getNeeds = async ({ needs = null }, planId, tokens) => {
  if (!needs || needs.length === 0) return []

  const needsData = await getSentencePlanNeeds(planId, tokens).catch(error =>
    catchAndReThrowError(`Could not retrieve needs for sentence plan ${planId}`, error)
  )
  return needsData.length === 0 ? [] : needs.map(need => needsData.find(({ id }) => id === need).name)
}

const getObjectiveData = async (req, res, next) => {
  try {
    const {
      tokens,
      errors,
      errorSummary,
      params: { planId, objectiveId },
      renderInfo = {},
    } = req
    const objective = await getSentencePlanObjective(planId, objectiveId, tokens).catch(error =>
      catchAndReThrowError(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}`, error)
    )
    const { motivationList } = await getMotivation(null, null, tokens).catch(error =>
      catchAndReThrowError(`Could not retrieve motivation list`, error)
    )
    const displayObjective = {
      id: objective.id,
      description: objective.description,
      needs: await getNeeds(objective, planId, tokens),
    }
    // only get intervention data if there is an action with an intervention
    const hasInterventions = !objective.actions.every(({ intervention }) => !intervention)
    const interventionList = hasInterventions
      ? await getInterventions(tokens).catch(error =>
          catchAndReThrowError(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}`, error)
        )
      : []
    displayObjective.actions = objective.actions
      .map(action => {
        const { id, motivationUUID, owner, ownerOther, targetDate, status, progress, priority } = action
        const { monthName, year } = getYearMonthFromDate(targetDate)
        const ownerText = owner
          .map(ownerType => RESPONSIBLE_LIST.find(({ value }) => value === ownerType).text)
          .join(', ')

        const ownerOtherText = ownerOther ? `: ${ownerOther}` : ''
        return {
          id,
          actionText: getActionText(action, interventionList),
          motivation: motivationList.find(({ value }) => value === motivationUUID).text,
          targetDate: `${monthName} ${year}`,
          owner: `${ownerText}${ownerOtherText}`,
          status: getStatusText(status),
          progress,
          priority,
        }
      })
      .sort(({ priority: priority1 }, { priority: priority2 }) => (priority1 > priority2 ? 1 : -1))
    Object.assign(renderInfo, { errors, errorSummary, objective: displayObjective })
    Object.assign(req, { objective, motivationList, interventionList, renderInfo })
    return next()
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to retrieve your objective. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getObjectiveData, getNeeds }
