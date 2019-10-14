const logger = require('../../log')

module.exports = () => async (req, res) => {
  try {
    const {
      params: { id, sentencePlanId },
    } = req
    logger.info(`Attempting to persist motivations for oasys-offender-id '${id}' sentence-plan '${sentencePlanId}'`)
    return res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan/${sentencePlanId}/`)
  } catch (error) {
    logger.warn(`Could not persist motivations ${error}`)
    return res.redirect(`/`)
  }
}
