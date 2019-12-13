const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { setNewSentencePlanObjective, updateSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { getObjective } = require('./get.controller')
const { countWords, removeUrlLevels } = require('../../common/utils/util')

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
  ]
}

const postObjective = async (req, res) => {
  const {
    path,
    errors,
    body: { objective: objectiveDescription },
    params: { planId, objectiveId },
    session: { 'x-auth-token': token },
  } = req

  const backurl = removeUrlLevels(path, 2)

  if (errors) {
    const wordsOver = countWords(objectiveDescription) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    return getObjective(req, res)
  }

  try {
    const objective = {
      description: objectiveDescription,
      needs: [],
    }
    let redirectUrl
    if (objectiveId.toLowerCase() === 'new') {
      const newObjective = await setNewSentencePlanObjective(planId, objective, token)
      redirectUrl = `${newObjective.id}/edit-action/NEW`
    } else {
      await updateSentencePlanObjective(planId, objectiveId, objective, token)
      redirectUrl = backurl
    }
    return res.redirect(redirectUrl)
  } catch (error) {
    logger.error(`Could not save sentence plan objective ${objectiveId} for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postObjective, objectiveValidationRules: validationRules }
