const logger = require('../../log')

module.exports = () => async (req, res) => {
  try {
    const {
      params: { id, sentencePlanId },
    } = req
    return res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/`)
  } catch (error) {
    logger.warn(`Could not persist progress ${error}`)
    return res.redirect(`/`)
  }
}
