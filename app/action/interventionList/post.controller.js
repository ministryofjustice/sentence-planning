const { body } = require('express-validator')
const { countWords } = require('../../../common/utils/util')
const { logger } = require('../../../common/logging/logger')
const { UUID_REGEX } = require('../../../common/utils/util')

const wordsAllowed = 50

const validationRules = () => {
  return [
    body('actionType')
      .isIn(['description', 'intervention'])
      .withMessage('Select an action'),
    body('description')
      .if(body('actionType').equals('description'))
      .isLength({ min: 1 })
      .withMessage('Describe the action')
      .bail()
      .if(body('actionType').equals('description'))
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage(`Action description must be ${wordsAllowed} words or fewer`)
      .bail()
      .trim()
      .escape(),
    body('intervention')
      .if(body('actionType').equals('intervention'))
      .matches(UUID_REGEX, 'i')
      .withMessage('Select an intervention'),
  ]
}
const postActionDescriptionIntervention = ({ actionType, intervention: interventionUUID = '', description = '' }) => {
  logger.debug(`extracting actionType ${actionType}, description ${description}, interventionUUID ${interventionUUID}`)
  return actionType === 'intervention' ? { interventionUUID, description: '' } : { interventionUUID: '', description }
}

module.exports = { postActionDescriptionIntervention, actionDescriptionInterventionValidationRules: validationRules }
