const { equals } = require('../utils/functionalHelpers')
const { validate } = require('../utils/fieldValidation')
const logger = require('../../log')

module.exports = function createSomeService(formClient) {
  async function getFormResponse(userId) {
    const data = await formClient.getFormDataForUser(userId)

    return data.rows[0] || {}
  }

  async function updateAction({ oaSysId, sentencePlanId, actionId, existingData, newData, formId }) {
    const updatedFormObject = existingData
    logger.debug(`^^^ ${sentencePlanId} ${actionId}`)
    if (!updatedFormObject.sentencePlans) updatedFormObject.sentencePlans = []
    let sentencePlan = updatedFormObject.sentencePlans.find(({ sentencePlanId: id }) => {
      return id === sentencePlanId
    })
    if (!sentencePlan) {
      sentencePlan = { sentencePlanId, actions: [] }
      updatedFormObject.sentencePlans.push(sentencePlan)
      logger.debug(`^^^ sentence plan not found creating ${JSON.stringify(updatedFormObject.sentencePlans)}`)
    }
    const actionIndex = sentencePlan.actions.findIndex(({ actionId: id }) => {
      return id === actionId
    })
    const newAction = { ...newData, actionId }
    logger.debug(`^^^ new action ${JSON.stringify(newAction)}`)
    if (actionIndex === -1) {
      sentencePlan.actions.push(newAction)
    } else {
      sentencePlan.actions[actionIndex] = newAction
    }
    logger.debug(`^^^ updatedFormObject ${JSON.stringify(updatedFormObject)}`)
    await formClient.update(formId, updatedFormObject, oaSysId)
    return updatedFormObject
  }

  async function update({ userId, formId, formObject, config, userInput, formSection, formName }) {
    const updatedFormObject = getUpdatedFormObject({
      formObject,
      fieldMap: config.fields,
      userInput,
      formSection,
      formName,
    })

    if (equals(formObject, updatedFormObject)) {
      return formObject
    }

    await formClient.update(formId, updatedFormObject, userId)
    return updatedFormObject
  }

  function getUpdatedFormObject({ formObject, fieldMap, userInput, formSection, formName }) {
    const answers = fieldMap.reduce(answersFromMapReducer(userInput), {})

    return {
      ...formObject,
      [formSection]: {
        ...formObject[formSection],
        [formName]: answers,
      },
    }
  }

  function answersFromMapReducer(userInput) {
    return (answersAccumulator, field) => {
      const { fieldName, answerIsRequired } = getFieldInfo(field, userInput)

      if (!answerIsRequired) {
        return answersAccumulator
      }

      return { ...answersAccumulator, [fieldName]: userInput[fieldName] }
    }
  }

  function getFieldInfo(field, userInput) {
    const fieldName = Object.keys(field)[0]
    const fieldConfig = field[fieldName]

    const fieldDependentOn = userInput[fieldConfig.dependentOn]
    const predicateResponse = fieldConfig.predicate
    const dependentMatchesPredicate = fieldConfig.dependentOn && fieldDependentOn === predicateResponse

    return {
      fieldName,
      answerIsRequired: !fieldDependentOn || dependentMatchesPredicate,
    }
  }

  return {
    updateAction,
    getFormResponse,
    update,
    getValidationErrors: validate,
  }
}
