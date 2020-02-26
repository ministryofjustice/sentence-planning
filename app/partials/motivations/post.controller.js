const { body } = require('express-validator')
const { UUID_REGEX } = require('../../../common/utils/constants')

const validationRules = () => {
  return [
    body('motivation')
      .matches(UUID_REGEX, 'i')
      .withMessage('Choose a motivational level'),
  ]
}

module.exports = { motivationValidationRules: validationRules }
