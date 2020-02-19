const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { addSentencePlanObjectiveActionProgress } = require('../../common/data/sentencePlanningApi')
const { getActionUpdate } = require('./get.controller')
const { removeUrlLevels, countWords, catchAndReThrowError } = require('../../common/utils/util')

const wordsAllowed = 250
const { postTargetDate, targetDateValidationRules } = require('../partials/targetDate/post.controller')
const { motivationValidationRules } = require('../partials/motivations/post.controller')
const { postResponsibility, responsibilityValidationRules } = require('../partials/responsibility/post.controller')
const { statusValidationRules } = require('../partials/status/post.controller')

const validationRules = () => {
  return [
    ...targetDateValidationRules(),
    ...motivationValidationRules(),
    ...responsibilityValidationRules(),
    ...statusValidationRules(),
    body('comment')
      .isLength({ min: 1 })
      .withMessage('Enter a comment')
      .bail()
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage(`Comments must be ${wordsAllowed} words or fewer`)
      .bail()
      .trim()
      .escape(),
  ]
}

const postActionUpdate = async (req, res) => {
  const {
    path,
    errors,
    body: bodyData,
    params: { planId, objectiveId, actionId },
    tokens,
  } = req
  if (errors) {
    return getActionUpdate(req, res)
  }
  try {
    // temporarily add values to the progress
    const progress = {
      comment: bodyData.comment,
      ...postTargetDate(bodyData),
      motivationUUID: bodyData.motivation,
      ...postResponsibility(bodyData),
      status: bodyData.status,
    }
    await addSentencePlanObjectiveActionProgress(planId, objectiveId, actionId, progress, tokens).catch(error =>
      catchAndReThrowError(
        `Could not persist progress for action ${actionId} for objective ${objectiveId}, sentence plan ${planId}`,
        error
      )
    )
    return res.redirect(removeUrlLevels(path, 2))
  } catch (error) {
    logger.error(`Could not save action ${actionId}, for objective ${objectiveId} and plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postActionUpdate, actionUpdateValidationRules: validationRules }
