const { logger } = require('../../../common/logging/logger')
const { getSentencePlanComments } = require('../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../common/utils/getCommentText')

const getHomepage = async (req, res) => {
  const {
    session: { planStarted = false, 'x-auth-token': token },
    params: { planId, id },
  } = req
  try {
    delete req.session.planStarted
    const renderDetails = {}

    // get contact arrangements
    const comments = await getSentencePlanComments(planId, token)
    renderDetails.contactArrangements = getCommentText(comments, 'LIAISON_ARRANGEMENTS')

    return res.render(`${__dirname}/index`, { planId, id, planStarted, ...renderDetails })
  } catch (error) {
    logger.error(`Could not display active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getHomepage }
