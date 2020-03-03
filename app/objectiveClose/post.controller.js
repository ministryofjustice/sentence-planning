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
      .withMessage('Enter a reason')
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
    renderInfo,
  } = req

  if (!isEmptyObject(errors)) {
    const wordsOver = countWords(closeReason) - wordsAllowed
    req.renderInfo = Object.assign(renderInfo, { wordsOver: wordsOver > 0 ? wordsOver : 0 })
    return getCloseObjective(req, res)
  }

  try {
    const closeReasonText = {
      closeReason,
    }
    await updateSentencePlanObjectiveClose(planId, objectiveId, closeReasonText, tokens)
    const redirectUrl = removeUrlLevels(path, 3)
    return `${res.redirect(redirectUrl)}#objectives`
  } catch (error) {
    logger.error(`Could not close sentence plan objective ${objectiveId} for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postCloseObjective, closeObjectiveValidationRules: validationRules }
