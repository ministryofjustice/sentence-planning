const { body } = require('express-validator')
const { countWords } = require('../../../common/utils/util')
const { logger } = require('../../../common/logging/logger')

const wordsAllowed = 50

const validationRules = () => {
  return [
    body('actionType')
      .isIn(['description', 'intervention'])
      .withMessage('Select an action'),
    body('description')
      .if(body('actionType').equals('description'))
      .isLength({ min: 1 })
      .withMessage('Describe the action'),
    body('description')
      .if(body('actionType').equals('description'))
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage(`Action description must be ${wordsAllowed} words or fewer`),
    body('description')
      .trim()
      .escape(),
    body('intervention')
      .if(body('actionType').equals('intervention'))
      .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'i')
      .withMessage('Select an intervention'),
  ]
}
const postActionDescriptionIntervention = ({ actionType, intervention = '', description = '' }) => {
  logger.debug(`extracting actionType ${actionType}, description ${description}, intervention ${intervention}`)
  return actionType === 'intervention' ? { intervention, description: '' } : { intervention: '', description }
}

module.exports = { postActionDescriptionIntervention, actionDescriptionInterventionValidationRules: validationRules }
