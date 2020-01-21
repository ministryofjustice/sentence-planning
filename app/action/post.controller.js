const { logger } = require('../../common/logging/logger')
const {
  addSentencePlanObjectiveAction,
  updateSentencePlanObjectiveAction,
} = require('../../common/data/sentencePlanningApi')
const { getAction } = require('./get.controller')
const { removeUrlLevels } = require('../../common/utils/util')
// temporary action mock
const mockAction = require('../../mockServer/sentencePlanActions/1.json')
const {
  postActionDescriptionIntervention,
  actionDescriptionInterventionValidationRules,
} = require('./interventionList/post.controller')
const { postTargetDate, targetDateValidationRules } = require('./targetDate/post.controller')
const { motivationValidationRules } = require('./motivations/post.controller')
const { statusValidationRules } = require('./status/post.controller')

const validationRules = () => {
  return [
    ...actionDescriptionInterventionValidationRules(),
    ...targetDateValidationRules(),
    ...motivationValidationRules(),
    ...statusValidationRules(),
  ]
}

const postAction = async (req, res) => {
  const {
    path,
    errors,
    body,
    params: { planId, objectiveId, actionId },
    session: { 'x-auth-token': token },
  } = req

  // temporarily add values to the action
  const action = {
    ...mockAction,
    ...postActionDescriptionIntervention(body),
    ...postTargetDate(body),
    motivationUUID: body.motivation,
    status: body.status,
  }
  if (errors) {
    return getAction(req, res)
  }

  try {
    if (actionId.toLowerCase() === 'new') {
      await addSentencePlanObjectiveAction(planId, objectiveId, action, token)
    } else {
      await updateSentencePlanObjectiveAction(planId, objectiveId, actionId, action, token)
    }
    const nextUrl =
      body.addAnotherAction !== '' ? `${removeUrlLevels(path, 2)}/review` : `${removeUrlLevels(path, 1)}/NEW`
    return res.redirect(nextUrl)
  } catch (error) {
    logger.error(`Could not save action ${actionId}, for objective ${objectiveId} and plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postAction, actionValidationRules: validationRules }
