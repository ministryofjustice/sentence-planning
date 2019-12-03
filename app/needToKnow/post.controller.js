const { body } = require('express-validator')
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
  ]
}

const postNeedToKnow = async (req, res) => {
  if (req.errors) {
    const wordsOver = countWords(req.body.needtoknow) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    await getNeedToKnow(req, res)
  } else {
    const comment = [
      {
        comment: req.body.needtoknow,
        commentType: 'THEIR_RESPONSIVITY',
      },
    ]
    await setSentencePlanComment(req.params.planid, comment, req.session['x-auth-token'])
    res.redirect(req.path.substring(0, req.path.lastIndexOf('/')))
  }
}

module.exports = { postNeedToKnow, needToKnowValidationRules: validationRules }
