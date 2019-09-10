const logger = require('../../log')

module.exports = sentencePlanningService => async (req, res, next) => {
  try {
    const sentencePlans = await sentencePlanningService.getSentencePlans(
      res.locals.user.token,
      req.params.id || res.locals.oasysOffenderId
    )
    res.locals.sentencePlans = sentencePlans || []

    next()
  } catch (error) {
    logger.warn(`Cannot retrieve List of existing Sentence Plans. ${error}`)
    res.redirect('/')
  }
}
