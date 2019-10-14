const logger = require('../../log')

module.exports = sentencePlanningService => async (req, res) => {
  const {
    params: { id, sentencePlanId },
    body,
  } = req
  try {
    const token = req.get('X-Auth-Token')
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
