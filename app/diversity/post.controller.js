const { body } = require('express-validator')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getDiversity } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

const wordsAllowed = 250
let tooManyWords = false

const validationRules = () => {
  return [
    body('diversity')
      .isLength({ min: 1 })
      .withMessage('Record how you will take account of diversity factors'),
    body('diversity')
      .custom(value => {
        tooManyWords = countWords(value) > wordsAllowed
        return !tooManyWords
      })
      .withMessage('Response to diversity factors must be 250 words or fewer'),
  ]
}

const postDiversity = async (req, res) => {
  if (req.errors) {
    const renderInfo = {}
    let wordsOver = false
    if (tooManyWords || req.tooManyWords) {
      wordsOver = countWords(req.body.diversity) - wordsAllowed
    }
    renderInfo.wordsOver = wordsOver
    req.renderInfo = renderInfo
    await getDiversity(req, res)
  } else if (req.body.diversity) {
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
