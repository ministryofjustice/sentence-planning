const { body } = require('express-validator')

const validationRules = () => {
  return [
    body('status')
      .isIn(['NOT_STARTED', 'IN_PROGRESS'])
      .withMessage('Choose a status'),
  ]
}
const postStatus = ({ status }) => ({ status })

module.exports = { postStatus, statusValidationRules: validationRules }
