const { logger } = require('../../../common/logging/logger')

const getHomepage = async ({ params: { planId, id } }, res) => {
  try {
    return res.render(`${__dirname}/index`, { planId, id })
  } catch (error) {
    logger.error(`Could not display active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getHomepage }
