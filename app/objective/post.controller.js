const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { setNewSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { getObjective } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

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
    errorSummary,
    body,
    renderInfo,
    params: { planId, objectiveId },
    session: { 'x-auth-token': token },
  } = req
  if (errors) {
    const wordsOver = countWords(body.objective) - wordsAllowed
    renderInfo.wordsOver = wordsOver > 0 ? wordsOver : 0
    return getObjective(req, res)
  }
  try {
    const objective = {
      description: body.objective,
      needs: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    }
    await setNewSentencePlanObjective(planId, objective, req.session['x-auth-token'])
    return res.redirect(req.path.substring(0, req.path.lastIndexOf('/')))
  } catch (error) {
    logger.error(`Could not save sentence plan comments 'THEIR_SUMMARY' for plan ${req.params.planid}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postObjective, objectiveValidationRules: validationRules }
