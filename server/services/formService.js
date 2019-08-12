const { equals } = require('../utils/functionalHelpers')
const { validate } = require('../utils/fieldValidation')

module.exports = function createSomeService(formClient) {
  async function getFormResponse(userId) {
    const data = await formClient.getFormDataForUser(userId)

    return data.rows[0] || {}
  }

  async function addProgress({ oaSysId, sentencePlanId, stepId, existingData, progress, formId }) {
    const updatedFormObject = existingData
    try {
      const step = updatedFormObject.sentencePlans
        .find(({ sentencePlanId: spId }) => spId === sentencePlanId)
        .steps.find(({ stepId: sId }) => sId === stepId)
      if (!step.progress) step.progress = []
      step.progress.push(progress)
      await formClient.update(formId, updatedFormObject, oaSysId)
      return updatedFormObject
    } catch (error) {
      return `Cannot add progress. ERROR: ${error}`
    }
  }

  async function updateStep({ oaSysId, sentencePlanId, stepId, existingData, newData, formId }) {
    const updatedFormObject = existingData
    if (!updatedFormObject.sentencePlans) updatedFormObject.sentencePlans = []
    let sentencePlan = updatedFormObject.sentencePlans.find(({ sentencePlanId: id }) => {
      return id === sentencePlanId
    })
    if (!sentencePlan) {
      sentencePlan = { sentencePlanId, steps: [], dateCreated: new Date().toISOString() }
      updatedFormObject.sentencePlans.push(sentencePlan)
    }
    const stepIndex = sentencePlan.steps.findIndex(({ stepId: id }) => {
      return id === stepId
    })
    const newStep = { ...newData, stepId }
    if (stepIndex === -1) {
      sentencePlan.steps.push(newStep)
    } else {
      Object.assign(sentencePlan.steps[stepIndex], newStep)
    }
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
    updateStep,
    addProgress,
    getFormResponse,
    update,
    getValidationErrors: validate,
  }
}
