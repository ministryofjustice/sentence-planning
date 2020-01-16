const { logger } = require('../../../common/logging/logger')

const getHomepage = async (req, res) => {
  const {
    session: { planStarted = false },
    params: { planId, id },
  } = req
  try {
    delete req.session.planStarted
    return res.render(`${__dirname}/index`, { planId, id, planStarted })
  } catch (error) {
    logger.error(`Could not display active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getHomepage }
