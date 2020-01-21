const { logger } = require('../../../common/logging/logger')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../common/utils/getCommentText')

const getHomepage = async (req, res) => {
  const {
    session: { planStarted = false, 'x-auth-token': token },
    params: { planId, id },
  } = req
  try {
    delete req.session.planStarted

    const { comments } = await getSentencePlan(planId, token)

    return res.render(`${__dirname}/index`, {
      planId,
      id,
      planStarted,
      contactArrangements: getCommentText(comments, 'LIAISON_ARRANGEMENTS'),
      diversity: getCommentText(comments, 'YOUR_RESPONSIVITY'),
      decisions: getCommentText(comments, 'YOUR_SUMMARY'),
      needToKnow: getCommentText(comments, 'THEIR_RESPONSIVITY'),
      comments: getCommentText(comments, 'THEIR_SUMMARY'),
    })
  } catch (error) {
    logger.error(`Could not display active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getHomepage }
