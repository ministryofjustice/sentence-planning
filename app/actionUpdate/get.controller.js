const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjectiveAction, getInterventions } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels, catchAndReThrowError } = require('../../common/utils/util')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getMotivation } = require('../partials/motivations/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')
const { RESPONSIBLE_LIST, STATUS_LIST } = require('../../common/utils/constants')

const getInterventionText = async (token, intervention) => {
  const interventionList = await getInterventions(token).catch(error =>
    catchAndReThrowError('Could not retrieve the action intervention/description.', error)
  )
  return interventionList.find(({ uuid }) => uuid === intervention).shortDescription
}

const processProgress = (progress = [], motivationList) => {
  return progress
    .map(
      ({
        comment,
        created = '',
        createdBy = '',
        motivationUUID = '',
        status = '',
        targetDate = '',
        owner = '',
        ownerOther = '',
      }) => {
        const ownerText = owner ? RESPONSIBLE_LIST.find(({ value }) => value === owner).text : ''
        const statusText = status ? STATUS_LIST.find(({ value }) => value === status).text : ''
        const motivationText = motivationUUID ? motivationList.find(({ value }) => value === motivationUUID).text : ''
        return {
          type: 'Action Updated',
          created,
          createdBy,
          data: [
            { key: 'Status', value: statusText },
            { key: 'Target date', value: targetDate },
            { key: 'Motivation', value: motivationText },
            { key: 'Owner', value: ownerText },
            { key: 'Owner other', value: ownerOther },
            { key: 'Comment', value: comment },
          ].filter(({ value }) => value),
        }
      }
    )
    .reverse()
}

const getActionUpdate = async (
  { path, errors, errorSummary, body, params: { planId, objectiveId, actionId }, tokens },
  res
) => {
  try {
    const action = await getSentencePlanObjectiveAction(planId, objectiveId, actionId, tokens).catch(error =>
      catchAndReThrowError(
        `Could not retrieve action ${actionId} for objective ${objectiveId}, sentence plan ${planId}`,
        error
      )
    )
    const backUrl = `${removeUrlLevels(path, 2)}`
    const { intervention, description, progress, created = '' } = action
    const [actionText, { motivationList }] = await Promise.all([
      intervention ? await getInterventionText(tokens, intervention) : description,
      await getMotivation(action, body, tokens),
    ])
    const timelineData = processProgress(progress, motivationList)
    if (created) timelineData.push({ type: 'Action Created', created })
    return res.render(`${__dirname}/index`, {
      ...body,
      errors,
      errorSummary,
      actionText,
      ...getTargetDate(action, body),
      motivationList,
      ...getResponsibility(action, body),
      ...getStatus(action, body),
      backUrl,
      timelineData,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to update an action. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getActionUpdate, getInterventionText, processProgress }
