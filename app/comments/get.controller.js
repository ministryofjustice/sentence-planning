const { logger } = require('../../common/logging/logger')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getComments = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId }, session: { 'x-auth-token': token } },
  res
) => {
  const nexturl = path.substring(0, path.lastIndexOf('/'))
  const renderDetails = { ...renderInfo, nexturl, backurl: `${nexturl}/decisions` }

  if (body.comments) {
    renderDetails.comments = body.comments
  }
  try {
    const comments = await getSentencePlanComments(planId, token)
    renderDetails.comments = getCommentText(comments, 'THEIR_SUMMARY')
    return res.render(`${__dirname}/index`, { ...renderDetails, ...body, errors, errorSummary })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getComments }
