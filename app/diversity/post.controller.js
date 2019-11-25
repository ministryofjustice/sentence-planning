const { body } = require('express-validator')
const { postSentencePlanComments } = require('../../common/data/sentencePlanComments')

const validationRules = () => {
  return [
    body('diversity')
      .isLength({ min: 1 })
      .withMessage('Record how you will take account of diversity factors'),
    body('diversity')
      .isLength({ max: 250 })
      .withMessage('Response to diversity factors must be 250 words or fewer'),
  ]
}

const postDiversity = async (req, res) => {
  if (req.errors) {
    res.render(`${__dirname}/index`, { errorSummary: req.errorSummary, errors: req.errors, ...req.body })
  } else {
    // post comment
    if (req.body.diversity) {
      const comment = [
        {
          comment: req.body.diversity,
          commentType: 'YOUR_RESPONSIVITY',
        },
      ]
      await postSentencePlanComments(req.params.planid, comment, req.session['x-auth-token'])
    }

    res.redirect('./needtoknow')
  }
}

module.exports = { postDiversity, diversityValidationRules: validationRules }
