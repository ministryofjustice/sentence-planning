const logger = require('../../log')

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const {
      formObject: { sentencePlans },
    } = locals
    locals.sentencePlanId = sentencePlanId
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    locals.sentencePlan = sentencePlans.find(({ sentencePlanId: spId }) => sentencePlanId === spId)
    return res.render('../views/formPages/motivations', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
