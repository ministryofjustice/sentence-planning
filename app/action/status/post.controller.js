const { body } = require('express-validator')

const validationRules = () => {
  return [
    body('status')
      .isIn(['NOT_STARTED', 'IN_PROGRESS'])
      .withMessage('Choose a status'),
  ]
}

module.exports = { statusValidationRules: validationRules }
