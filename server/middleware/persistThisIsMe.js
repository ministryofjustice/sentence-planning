const { thisIsMe: thisIsMeFormConfig } = require('../config/thisIsMe')
const { isNilOrEmpty, getFieldName, pickBy } = require('../utils/utils')
const logger = require('../../log')

module.exports = (formService, sentencePlanningService) => async (req, res) => {
  const {
    params: { id, sentencePlanId },
    body,
  } = req
  try {
    const expectedFields = thisIsMeFormConfig.fields.map(getFieldName)
    const inputForExpectedFields = pickBy((val, key) => expectedFields.includes(key), body)
    if (thisIsMeFormConfig.validate) {
      const formResponse = inputForExpectedFields
      const errors = formService.getValidationErrors(formResponse, thisIsMeFormConfig)

      if (!isNilOrEmpty(errors)) {
        req.flash('errors', errors)
        req.flash('userInput', inputForExpectedFields)
        return res.redirect(req.header('Referer') || req.originalUrl)
      }
    }
    const {
      locals: {
        user: { token },
      },
    } = res
    const updatedSentencePlanId =
      sentencePlanId === 'new' ? await sentencePlanningService.createSentencePlan(token, id).id : sentencePlanId
    await sentencePlanningService.updateServiceUserComments(token, updatedSentencePlanId, body.offenderStatement)
    return res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${updatedSentencePlanId}/`)
  } catch (error) {
    logger.warn(
      `Could not ${sentencePlanId === 'new' ? 'create NEW sentence Plan' : 'persist serviceUserComment'} ${error}`
    )
    return res.redirect(`/`)
  }
}
