const { body } = require('express-validator')

const errorMessage = 'Select the person responsible'
const options = ['SERVICE_USER', 'PRACTITIONER', 'OTHER']
const otherMaxChars = 250

const validationRules = () => {
  return [
    body('responsibility', errorMessage)
      .not()
      .isEmpty()
      .bail()
      .if(responsibility => !Array.isArray(responsibility))
      .isString()
      .isIn(options),
    body('responsibility', errorMessage)
      .if(responsibility => Array.isArray(responsibility))
      .isArray({ min: 1, max: 3 })
      .custom((responsibility = []) =>
        responsibility.reduce((validates, value) => validates && options.includes(value), true)
      ),
    body('responsibilityOther', 'Name the person responsible')
      .if((_val, { req: { body: { responsibility = '' } } }) => responsibility.includes('OTHER'))
      .not()
      .isEmpty()
      .isString()
      .bail()
      .trim()
      .escape()
      .isLength({ min: 1, max: otherMaxChars })
      .withMessage(`Name must be ${250} characters or fewer`),
  ]
}
const postResponsibility = ({ responsibility: owner = [], responsibilityOther: ownerOther }) => {
  return { owner: Array.isArray(owner) ? owner : [owner], ownerOther: owner.includes('OTHER') ? ownerOther : '' }
}

module.exports = { postResponsibility, responsibilityValidationRules: validationRules }
