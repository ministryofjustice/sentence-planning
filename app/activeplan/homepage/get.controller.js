const { logger } = require('../../../common/logging/logger')
const { getSentencePlan, getSentencePlanReviews } = require('../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../common/utils/getCommentText')

const getHomepage = async (req, res) => {
  const {
    session: { planStarted = false, 'x-auth-token': token },
    params: { planId, id },
  } = req

  let sentencePlan
  let meetings

  delete req.session.planStarted

  // get the sentence plan
  try {
    sentencePlan = await getSentencePlan(planId, token)
  } catch (error) {
    logger.error(`Could not retrieve active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }

  // get review meetings
  try {
    meetings = await getSentencePlanReviews(id, token)
  } catch (error) {
    logger.error(`Could not retrieve meetings for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }

  return res.render(`${__dirname}/index`, {
    planId,
    id,
    planStarted,
    contactArrangements: getCommentText(sentencePlan.comments, 'LIAISON_ARRANGEMENTS'),
    diversity: getCommentText(sentencePlan.comments, 'YOUR_RESPONSIVITY'),
    decisions: getCommentText(sentencePlan.comments, 'YOUR_SUMMARY'),
    needToKnow: getCommentText(sentencePlan.comments, 'THEIR_RESPONSIVITY'),
    comments: getCommentText(sentencePlan.comments, 'THEIR_SUMMARY'),
    meetings,
  })
}

module.exports = { getHomepage }
