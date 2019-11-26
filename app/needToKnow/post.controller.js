const { body } = require('express-validator')
const { postSentencePlanComments } = require('../../common/data/sentencePlanComments')
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
  const nexturl = req.path.substring(0, req.path.lastIndexOf('/'))
  if (req.errors) {
    const renderInfo = {}
    let wordsOver = false
    if (tooManyWords) {
      wordsOver = countWords(req.body.needtoknow) - wordsAllowed
    }
    renderInfo.wordsOver = wordsOver
    renderInfo.backurl = `${req.path.substring(0, req.path.lastIndexOf('/'))}/diversity`
    renderInfo.nexturl = nexturl
    res.render(`${__dirname}/index`, {
      errorSummary: req.errorSummary,
      errors: req.errors,
      ...req.body,
      ...renderInfo,
    })
  } else {
    if (req.body.diversity) {
      const comment = [
        {
          comment: req.body.diversity,
          commentType: 'THEIR_RESPONSIVITY',
        },
      ]
      await postSentencePlanComments(req.params.planid, comment, req.session['x-auth-token'])
    }

    res.redirect(nexturl)
  }
}

module.exports = { postNeedToKnow, needToKnowValidationRules: validationRules }
