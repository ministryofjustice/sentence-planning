const { validate } = require('../utils/fieldValidation')
const logger = require('../../log')

module.exports = function createSomeService(formClient) {
  async function getFormResponse(userId) {
    const data = await formClient.getFormDataForUser(userId)

    return data.rows[0] || {}
  }

  const getNextId = (objectArray, idParam) => {
    if (!objectArray || objectArray.length === 0) return '1'
    return (
      objectArray
        .filter(({ [idParam]: id = null }) => {
          return Number(id)
        })
        .map(({ [idParam]: id }) => {
          return Number(id)
        })
        .reduce((newId, oldId) => {
          return Math.max(newId, oldId)
        }) + 1
    ).toString()
  }

  async function updateMotivations({ oaSysId, sentencePlanId, existingData = {}, motivations, formId }) {
    try {
      const updatedFormObject = existingData
      if (!updatedFormObject.sentencePlans) updatedFormObject.sentencePlans = []
      updatedFormObject.sentencePlans.find(({ sentencePlanId: id }) => {
        return id === sentencePlanId
      }).motivations = motivations
      logger.info(`Updating motivations for offender ${oaSysId}, sentencePlanId ${sentencePlanId}`)
      await formClient.update(formId, updatedFormObject, oaSysId)
      return updatedFormObject
    } catch (error) {
      throw new Error(`Cannot update motivations. ERROR: ${error}`)
    }
  }

  async function updateOffenderStatement({ oaSysId, sentencePlanId, existingData = {}, offenderStatement, formId }) {
    try {
      const updatedFormObject = existingData
      if (!updatedFormObject.sentencePlans) updatedFormObject.sentencePlans = []
      if (sentencePlanId === 'new') {
        updatedFormObject.sentencePlans.push({
          sentencePlanId: getNextId(updatedFormObject.sentencePlans, 'sentencePlanId'),
          steps: [],
          pastSteps: [],
          dateCreated: new Date().toISOString(),
          offenderStatement,
        })
      } else {
        updatedFormObject.sentencePlans.find(({ sentencePlanId: id }) => {
          return id === sentencePlanId
        }).offenderStatement = offenderStatement
      }
      logger.info(`Updating offender Statement for offender ${oaSysId}, sentencePlanId ${sentencePlanId}`)
      await formClient.update(formId, updatedFormObject, oaSysId)
      return updatedFormObject
    } catch (error) {
      throw new Error(`Cannot update offender statement. ERROR: ${error}`)
    }
  }

  async function addProgress({ oaSysId, sentencePlanId, stepId, existingData, progress, formId }) {
    const updatedFormObject = existingData
    try {
      const step = updatedFormObject.sentencePlans
        .find(({ sentencePlanId: spId }) => spId === sentencePlanId)
        .steps.find(({ stepId: sId }) => sId === stepId)
      if (!step.progress) step.progress = []
      step.progress.push(progress)
      logger.info(`Updating progress for offender ${oaSysId}, sentencePlanId ${sentencePlanId}`)
      await formClient.update(formId, updatedFormObject, oaSysId)
      return updatedFormObject
    } catch (error) {
      throw new Error(`Cannot add progress. ERROR: ${error}`)
    }
  }

  async function updateStep({ oaSysId, sentencePlanId, stepId, existingData, newData, formId }) {
    try {
      const updatedFormObject = existingData
      const sentencePlan = updatedFormObject.sentencePlans.find(({ sentencePlanId: id }) => {
        return id === sentencePlanId
      })
      const stepIndex = sentencePlan.steps.findIndex(({ stepId: id }) => {
        return id === stepId
      })
      const newStep = { ...newData, stepId }
      if (stepIndex === -1) {
        sentencePlan.steps.push(newStep)
      } else {
        Object.assign(sentencePlan.steps[stepIndex], newStep)
      }
      logger.info(`Updating step ${stepId} for offender ${oaSysId}, sentencePlanId ${sentencePlanId}`)
      await formClient.update(formId, updatedFormObject, oaSysId)
      return updatedFormObject
    } catch (error) {
      throw new Error(`Cannot update step. ERROR: ${error}`)
    }
  }

  return {
    updateOffenderStatement,
    updateMotivations,
    updateStep,
    addProgress,
    getFormResponse,
    getValidationErrors: validate,
  }
}
