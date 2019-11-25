const { body } = require('express-validator')

const validationRules = () => {
  return [
    body('diversity')
      .isLength({ min: 1 })
      .withMessage('Record how you will take account of diversity factors'),
    body('diversity')
      .isLength({ max: 250 })
      .withMessage('Response to diversity factors must be 50 words or fewer'),
  ]
}

const postDiversity = async (req, res) => {
  if (req.errors) {
    res.render(`${__dirname}/index`, { errorSummary: req.errorSummary, errors: req.errors, ...req.body })
  } else {
    res.redirect('./needtoknow')
  }
}

module.exports = { postDiversity, diversityValidationRules: validationRules }
