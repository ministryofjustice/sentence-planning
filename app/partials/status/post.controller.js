const { body } = require('express-validator')
const { STATUS_LIST } = require('../../../common/utils/util')

const validationRules = initial => {
  const statusList = STATUS_LIST.filter(({ initialStatus }) => !initial || initialStatus).map(({ value }) => value)
  return [
    body('status')
      .isIn(statusList)
      .withMessage('Choose a status'),
  ]
}

module.exports = { statusValidationRules: validationRules }
