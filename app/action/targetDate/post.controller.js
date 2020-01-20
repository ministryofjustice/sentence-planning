const { body } = require('express-validator')
const { BLANK_ERROR } = require('../../../common/utils/formatErrors')

const validationRules = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const eitherPresent = (
    _val,
    {
      req: {
        body: { 'target-date-Month': month, 'target-date-Year': year },
      },
    }
  ) => month !== '' || year !== ''

  return [
    body('target-date-Month')
      .custom(eitherPresent)
      .withMessage('Enter the target date for the action')
      .bail()
      .not()
      .isEmpty()
      .withMessage('Enter the target month for the action')
      .bail()
      .isInt({ min: 1, max: 12 })
      .withMessage('Month must be a number between 1 and 12'),
    body('target-date-Year')
      .custom(eitherPresent)
      .withMessage(BLANK_ERROR)
      .bail()
      .not()
      .isEmpty()
      .withMessage('Enter the target year for the action')
      .bail()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be a 4-digit number')
      .bail()
      .matches(/^20/)
      .withMessage('Year must start with 20')
      .bail()
      .isInt({ max: currentYear + 10 })
      .withMessage('Year must be no more than 10 years from now')
      .bail()
      .custom(
        (
          year,
          {
            req: {
              body: { 'target-date-Month': month },
            },
          }
        ) => new Date(year, month - 1) >= new Date(currentYear, currentDate.getMonth())
      )
      .withMessage('Target date must be in the future'),
  ]
}
const postTargetDate = ({ 'target-date-Month': month, 'target-date-Year': year }) => {
  return { targetDate: new Date(Date.UTC(year, month - 1)).toISOString() }
}

module.exports = { postTargetDate, targetDateValidationRules: validationRules }
