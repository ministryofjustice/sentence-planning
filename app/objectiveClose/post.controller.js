const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { getCloseObjective } = require('./get.controller')
const { updateSentencePlanObjectiveClose } = require('../../common/data/sentencePlanningApi')
const { countWords, isEmptyObject, removeUrlLevels } = require('../../common/utils/util')

const wordsAllowed = 250

const validationRules = () => {
  return [
    body('closeReason')
      .isLength({ min: 1 })
      .withMessage('Enter a reason for closing the objective')
      .bail()
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage(`Reason must be ${wordsAllowed} words or fewer`)
      .bail()
      .trim()
      .escape(),
  ]
}

const postCloseObjective = async (req, res) => {
  const {
    tokens,
    path,
    errors,
    body: { closeReason },
    params: { planId, objectiveId },
  } = req

  if (!isEmptyObject(errors)) {
    return getCloseObjective(req, res)
  }

  try {
    await updateSentencePlanObjectiveClose(
      planId,
      objectiveId,
      {
        comment: closeReason,
      },
      tokens
    )
    const redirectUrl = `${removeUrlLevels(path, 3)}#objectives`
    return `${res.redirect(redirectUrl)}`
  } catch (error) {
    logger.error(`Could not close sentence plan objective ${objectiveId} for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postCloseObjective, closeObjectiveValidationRules: validationRules }
