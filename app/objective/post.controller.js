const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { addSentencePlanObjective, updateSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { getObjective } = require('./get.controller')
const { countWords, isEmptyObject, removeUrlLevels } = require('../../common/utils/util')
const { BLANK_ERROR } = require('../../common/utils/formatErrors')

const wordsAllowed = 50

const validationRules = () => {
  const confirmNoNeeds = (
    _val,
    {
      req: {
        session: { noNeedsAvailable = false },
      },
    }
  ) => {
    if (!noNeedsAvailable) {
      return true
    }
    return noNeedsAvailable && _val === 'confirm'
  }

  const noNeeds = (
    _val,
    {
      req: {
        session: { noNeedsAvailable = false },
      },
    }
  ) => !noNeedsAvailable

  return [
    body('objective')
      .isLength({ min: 1 })
      .withMessage('Describe the objective')
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage('Objective description must be 50 words or fewer')
      .trim()
      .escape(),
    body('needs')
      .custom(noNeeds)
      .withMessage(BLANK_ERROR)
      .bail()
      .isLength({ min: 1 })
      .withMessage('Select the needs for this objective')
      .toArray(),
    body('noNeedsConfirmation', 'You must confirm that you have completed the OASys risk assessment').custom(
      confirmNoNeeds
    ),
  ]
}

const postObjective = async (req, res) => {
  const {
    path,
    errors,
    body: { objective: objectiveDescription, needs = '' },
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

    let redirectUrl = path.match(/\/plan\/[0-9a-zA-Z-]+\/edit-objective\/NEW+$/g)
      ? `${removeUrlLevels(path, 2)}/objective/`
      : ''
    if (objectiveId.toLowerCase() === 'new') {
      const newObjective = await addSentencePlanObjective(planId, objective, token)
      redirectUrl += `${newObjective.id}/edit-action/NEW`
    } else {
      await updateSentencePlanObjective(planId, objectiveId, objective, token)
      redirectUrl += `${objectiveId}/review`
    }
    return res.redirect(redirectUrl)
  } catch (error) {
    logger.error(`Could not save sentence plan objective ${objectiveId} for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postObjective, objectiveValidationRules: validationRules }
