const { body } = require('express-validator')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getNeedToKnow } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

const wordsAllowed = 250
let tooManyWords = false

const validationRules = () => {
  return [
    body('needtoknow')
      .isLength({ min: 1 })
      .withMessage('Add any other things the individual needs us to know about them'),
    body('needtoknow')
      .custom(value => {
        tooManyWords = countWords(value) > wordsAllowed
        return !tooManyWords
      })
      .withMessage('They need us to know must be 250 words or fewer'),
  ]
}

const postNeedToKnow = async (req, res) => {
  if (req.errors) {
    const renderInfo = {}
    let wordsOver = false
    if (tooManyWords || req.tooManyWords) {
      wordsOver = countWords(req.body.needtoknow) - wordsAllowed
    }
    renderInfo.wordsOver = wordsOver
    req.renderInfo = renderInfo
    await getNeedToKnow(req, res)
  } else if (req.body.needtoknow) {
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
