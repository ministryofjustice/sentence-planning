const logger = require('../../log')

module.exports = sentencePlanningService => async (req, res, next) => {
  try {
    const sentencePlans = await sentencePlanningService.getSentencePlans(
      req.get('X-Auth-Token'),
      req.params.id || res.locals.oasysOffenderId
    )
    res.locals.sentencePlans = sentencePlans || []

    next()
  } catch (error) {
    logger.warn(`Cannot retrieve List of existing Sentence Plans. ${error}`)
    res.redirect('/')
  }
}
