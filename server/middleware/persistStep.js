const { step: stepFormConfig } = require('../config/step')
const { isNilOrEmpty, getFieldName, pickBy } = require('../utils/functionalHelpers')
const logger = require('../../log')

const getNextId = (objectArray, idParam) => {
  if (!objectArray || objectArray.length === 0) return '1'
  return (
    objectArray
      .filter(({ [idParam]: id = null }) => {
        return Number(id)
      })
      .map(({ [idParam]: id }) => {
        return id
      })
      .reduce((newId, oldId) => {
        return Math.max(newId, oldId)
      }) + 1
  ).toString()
}
const validateSentencePlanAndStepIds = (rawSentencePlanId, rawStepId, formObject) => {
  const sentencePlanId =
    rawSentencePlanId === 'new' ? getNextId(formObject.sentencePlans, 'sentencePlanId') : rawSentencePlanId
  let stepId
  if (!formObject || !formObject.sentencePlans) {
    stepId = '1'
  } else {
    const sentencePlan = formObject.sentencePlans.find(({ sentencePlanId: testSentencePlanId }) => {
      return sentencePlanId === testSentencePlanId
    })
    const steps = sentencePlan && sentencePlan.steps ? sentencePlan.steps : []
    const pastSteps = sentencePlan && sentencePlan.pastSteps ? sentencePlan.pastSteps : []
    stepId = rawStepId === 'new' ? getNextId([...steps, ...pastSteps], 'stepId') : rawStepId
  }
  return { sentencePlanId, stepId }
}

module.exports = formService => async (req, res) => {
  try {
    const {
      params: { id, sentencePlanId: rawSentencePlanId, stepId: rawStepId },
    } = req
    const { sentencePlanId, stepId } = validateSentencePlanAndStepIds(
      rawSentencePlanId,
      rawStepId,
      res.locals.formObject
    )

    if (!Array.isArray(req.body.needs)) req.body.needs = [req.body.needs]
    const expectedFields = stepFormConfig.fields.map(getFieldName)
    const inputForExpectedFields = pickBy((val, key) => expectedFields.includes(key), req.body)
    if (stepFormConfig.validate) {
      const formResponse = inputForExpectedFields
      const errors = formService.getValidationErrors(formResponse, stepFormConfig)

      if (!isNilOrEmpty(errors)) {
        req.flash('errors', errors)
        req.flash('userInput', inputForExpectedFields)
        return res.redirect(req.header('Referer') || req.originalUrl)
      }
    }
    const currentTimeIsoString = new Date().toISOString()
    inputForExpectedFields.dateCreated = res.locals.formObject.dateCreated || currentTimeIsoString
    inputForExpectedFields.dateUpdated = currentTimeIsoString

    await formService.updateStep({
      oaSysId: req.params.id,
      existingData: res.locals.formObject,
      sentencePlanId,
      stepId,
      newData: inputForExpectedFields,
      formId: res.locals.formId,
    })

    return res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/`)
  } catch (error) {
    logger.warn(`Could not persist Step ${error}`)
    return res.redirect(`/`)
  }
}
