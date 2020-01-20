const { body } = require('express-validator')

const validationRules = () => {
  return [
    body('motivation')
      .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'i')
      .withMessage('Choose a motivational level'),
  ]
}

module.exports = { motivationValidationRules: validationRules }
