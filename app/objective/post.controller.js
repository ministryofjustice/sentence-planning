const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { addSentencePlanObjective, updateSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { getObjective } = require('./get.controller')
const { countWords, removeUrlLevels, isEmptyObject } = require('../../common/utils/util')

const wordsAllowed = 50

const validationRules = () => {
  return [
    body('objective')
      .isLength({ min: 1 })
      .withMessage('Describe the objective'),
    body('objective')
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage('Objective description must be 50 words or fewer'),
    body('objective')
      .trim()
      .escape(),
    body('needs')
      .isLength({ min: 1 })
      .withMessage('Select the needs for this objective'),
    body('needs').toArray(),
  ]
}

const postObjective = async (req, res) => {
  const {
    path,
    errors,
    body: { objective: objectiveDescription, needs },
    params: { planId, objectiveId },
    headers: { 'x-auth-token': token },
    session: { noNeedsAvailable = false },
  } = req

  if (noNeedsAvailable) {
    delete errors.needs
  }

  if (!isEmptyObject(errors)) {
    const wordsOver = countWords(objectiveDescription) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    return getObjective(req, res)
  }

  try {
    const objective = {
      description: objectiveDescription,
      needs,
    }

    let redirectUrl
    if (objectiveId.toLowerCase() === 'new') {
      const newObjective = await addSentencePlanObjective(planId, objective, token)
      redirectUrl = `${newObjective.id}/edit-action/NEW`
    } else {
      await updateSentencePlanObjective(planId, objectiveId, objective, token)
      redirectUrl = removeUrlLevels(path, 2)
    }
    return res.redirect(redirectUrl)
  } catch (error) {
    logger.error(`Could not save sentence plan objective ${objectiveId} for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postObjective, objectiveValidationRules: validationRules }
