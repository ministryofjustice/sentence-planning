const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getNeedToKnow } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

const wordsAllowed = 250

const validationRules = () => {
  return [
    body('needtoknow')
      .isLength({ min: 1 })
      .withMessage('Add any other things the individual needs us to know about them'),
    body('needtoknow')
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage('They need us to know must be 250 words or fewer'),
    body('needtoknow')
      .trim()
      .escape(),
  ]
}

const postNeedToKnow = async (req, res) => {
  if (req.errors) {
    const wordsOver = countWords(req.body.needtoknow) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    return getNeedToKnow(req, res)
  }
  try {
    const comment = [
      {
        comment: req.body.needtoknow,
        commentType: 'THEIR_RESPONSIVITY',
      },
    ]
    await setSentencePlanComment(req.params.planId, comment, req.headers['x-auth-token'])
    return res.redirect(req.path.substring(0, req.path.lastIndexOf('/')))
  } catch (error) {
    logger.error(
      `Could not save sentence plan comments 'THEIR_RESPONSIVITY' for plan ${req.params.planId}, error: ${error}`
    )
    return res.render('app/error', { error })
  }
}

module.exports = { postNeedToKnow, needToKnowValidationRules: validationRules }
