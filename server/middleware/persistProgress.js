const { progress: progressFormConfig } = require('../config/progress')
const { isNilOrEmpty, getFieldName, pickBy } = require('../utils/functionalHelpers')
const logger = require('../../log')

module.exports = formService => async (req, res) => {
  try {
    const {
      params: { id, sentencePlanId, stepId },
    } = req

    const expectedFields = progressFormConfig.fields.map(getFieldName)
    const inputForExpectedFields = pickBy((val, key) => expectedFields.includes(key), req.body)
    if (progressFormConfig.validate) {
      const formResponse = inputForExpectedFields
      const errors = formService.getValidationErrors(formResponse, progressFormConfig)

      if (!isNilOrEmpty(errors)) {
        req.flash('errors', errors)
        req.flash('userInput', inputForExpectedFields)
        return res.redirect(req.header('Referer') || req.originalUrl)
      }
    }
    const currentTimeIsoString = new Date().toISOString()
    inputForExpectedFields.dateCreated = res.locals.formObject.dateCreated || currentTimeIsoString
    await formService.addProgress({
      oaSysId: req.params.id,
      existingData: res.locals.formObject,
      sentencePlanId,
      stepId,
      progress: inputForExpectedFields,
      formId: res.locals.formId,
    })
    return res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/`)
  } catch (error) {
    logger.warn(`Could not persist progress ${error}`)
    return res.redirect(`/`)
  }
}
