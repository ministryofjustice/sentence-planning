const { body } = require('express-validator')
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
    await getDecisions(req, res)
  } else {
    const comment = [
      {
        comment: req.body.decisions,
        commentType: 'YOUR_SUMMARY',
      },
    ]
    await setSentencePlanComment(req.params.planId, comment, req.session['x-auth-token'])
    res.redirect('./comments')
  }
}

module.exports = { postDecisions, decisionsValidationRules: validationRules }
