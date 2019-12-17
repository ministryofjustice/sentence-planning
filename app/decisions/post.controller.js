const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getDecisions } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

const wordsAllowed = 250

const validationRules = () => {
  return [
    body('decisions')
      .isLength({ min: 1 })
      .withMessage('Record your decisions'),
    body('decisions')
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage('Response to Your decisions must be 250 words or fewer'),
  ]
}

const postDecisions = async (req, res) => {
  if (req.errors) {
    const wordsOver = countWords(req.body.decisions) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    return getDecisions(req, res)
  }
  try {
    const comment = [
      {
        comment: req.body.decisions,
        commentType: 'YOUR_SUMMARY',
      },
    ]
    await setSentencePlanComment(req.params.planId, comment, req.session['x-auth-token'])
    return res.redirect('./comments')
  } catch (error) {
    logger.error(`Could not save sentence plan comments 'YOUR_SUMMARY' for plan ${req.params.planid}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postDecisions, decisionsValidationRules: validationRules }
