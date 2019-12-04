const { body } = require('express-validator')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getDiversity } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

const wordsAllowed = 250

const validationRules = () => {
  return [
    body('diversity')
      .isLength({ min: 1 })
      .withMessage('Record how you will take account of diversity factors'),
    body('diversity')
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage('Response to diversity factors must be 250 words or fewer'),
  ]
}

const postDiversity = async (req, res) => {
  if (req.errors) {
    const wordsOver = countWords(req.body.diversity) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    await getDiversity(req, res)
  } else {
    const comment = [
      {
        comment: req.body.diversity,
        commentType: 'YOUR_RESPONSIVITY',
      },
    ]
    await setSentencePlanComment(req.params.planid, comment, req.session['x-auth-token'])
    res.redirect('./need-to-know')
  }
}

module.exports = { postDiversity, diversityValidationRules: validationRules }