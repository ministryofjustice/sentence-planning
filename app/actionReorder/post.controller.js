const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { setActionPriorities } = require('../../common/data/sentencePlanningApi')
const { catchAndReThrowError } = require('../../common/utils/util')

const getActionRowKeys = bodyData => Object.keys(bodyData).filter(element => element.match(/^[0-9a-f-]{1,}$/g))

const validationRules = () => {
  return [
    body()
      // Check that all the priority index values are integers
      .custom(value =>
        getActionRowKeys(value).reduce((soFar, element) => soFar && Number.isInteger(Number(value[element])), false)
      )
      .withMessage('Priority values should all be integers')
      // Check all the priority index values are unique
      .custom(value =>
        getActionRowKeys(value)
          .map(element => Number(value[element]))
          .reduce((soFar, element, index, src) => soFar && src.lastIndexOf(element) === index, false)
      )
      .withMessage('Priority values are not unique'),
  ]
}

const postActionReorder = async (req, res) => {
  const {
    path,
    errors,
    body: bodyData,
    params: { planId, objectiveId },
    tokens,
  } = req
  const backUrl = `${path.substring(0, path.lastIndexOf('/'))}`
  if (errors) {
    Object.keys(errors).forEach(error => logger.error(`${error}: ${errors[error].text}`))
    return res.render('app/error', { error: 'An error occurred when trying to reorder the objective actions.' })
  }
  try {
    const actionPriorities = getActionRowKeys(bodyData).map(element => ({
      actionUUID: element,
      priority: Number(bodyData[element]),
    }))
    await setActionPriorities(planId, objectiveId, actionPriorities, tokens).catch(error =>
      catchAndReThrowError(`Could not persist priorities for objective ${objectiveId}, sentence plan ${planId}`, error)
    )
    return res.redirect(backUrl)
  } catch (error) {
    logger.error(`Could not save priorities for objective ${objectiveId} and plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postActionReorder, actionReorderValidationRules: validationRules }
