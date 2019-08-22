const { thisIsMe: thisIsMeFormConfig } = require('../config/thisIsMe')
const { isNilOrEmpty, getFieldName, pickBy } = require('../utils/functionalHelpers')
const logger = require('../../log')

module.exports = formService => async (req, res) => {
  try {
    const {
      params: { id, sentencePlanId },
    } = req
    const {
      locals: { formObject, formId },
    } = res
    const expectedFields = thisIsMeFormConfig.fields.map(getFieldName)
    const inputForExpectedFields = pickBy((val, key) => expectedFields.includes(key), req.body)
    if (thisIsMeFormConfig.validate) {
      const formResponse = inputForExpectedFields
      const errors = formService.getValidationErrors(formResponse, thisIsMeFormConfig)

      if (!isNilOrEmpty(errors)) {
        req.flash('errors', errors)
        req.flash('userInput', inputForExpectedFields)
        return res.redirect(req.header('Referer') || req.originalUrl)
      }
    }
    const { sentencePlans } = await formService.updateOffenderStatement({
      oaSysId: id,
      existingData: formObject,
      sentencePlanId,
      offenderStatement: inputForExpectedFields.offenderStatement,
      formId,
    })
    return sentencePlanId === 'new'
      ? res.redirect(
          `/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlans.reduce(
            (currentId, { sentencePlanId: nextId = 0 }) => {
              return currentId > nextId ? currentId : nextId
            },
            0
          )}/motivations`
        )
      : res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/`)
  } catch (error) {
    logger.warn(`Could not persist thisIsMe ${error}`)
    return res.redirect(`/`)
  }
}
