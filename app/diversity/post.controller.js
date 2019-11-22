const { body } = require('express-validator')

const validationRules = () => {
  console.log('in validation rules')
  return [
    body('diversity')
      .isLength({ min: 1 })
      .withMessage('Record how you will take account of diversity factors'),
    body('diversity')
      .isLength({ max: 5 })
      .withMessage('ooops I did it again from within me own postcontroller innit'),
  ]
}

const postDiversity = async (req, res) => {
  res.render(`${__dirname}/index`, { errorSummary: req.errorSummary, errors: req.errors })
}

module.exports = { postDiversity, diversityValidationRules: validationRules }
