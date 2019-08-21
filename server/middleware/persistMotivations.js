const { motivations: motivationsFormConfig } = require('../config/motivations')
const { isNilOrEmpty, getFieldName, pickBy } = require('../utils/functionalHelpers')
const logger = require('../../log')

module.exports = formService => async (req, res) => {
  try {
    const {
      params: { id, sentencePlanId, stepId },
      body,
    } = req
    const {
      locals: { formObject, formId, needs },
    } = res
    const motivations = {}
    needs.forEach(({ name }) => {
      motivations[name] = body[name]
    })
    const expectedFields = motivationsFormConfig.fields.map(getFieldName)
    const inputForExpectedFields = pickBy((val, key) => expectedFields.includes(key), { motivations })

    if (motivationsFormConfig.validate) {
      const formResponse = inputForExpectedFields
      const errors = formService.getValidationErrors(formResponse, motivationsFormConfig)

      if (!isNilOrEmpty(errors)) {
        req.flash('errors', errors)
        req.flash('userInput', inputForExpectedFields)
        return res.redirect(req.header('Referer') || req.originalUrl)
      }
    }
    await formService.updateMotivations({
      oaSysId: id,
      existingData: formObject,
      sentencePlanId,
      stepId,
      motivations,
      formId,
    })
    const sentencePlan = formObject.sentencePlans.find(({ sentencePlanId: spId }) => sentencePlanId === spId)
    return sentencePlan.steps.length === 0 && sentencePlan.pastSteps.length === 0
      ? res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/step/new`)
      : res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/`)
  } catch (error) {
    logger.warn(`Could not persist motivations ${error}`)
    return res.redirect(`/`)
  }
}
