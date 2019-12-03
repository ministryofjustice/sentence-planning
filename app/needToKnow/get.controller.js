const { logger } = require('../../common/logging/logger')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getNeedToKnow = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId }, session: { 'x-auth-token': token } },
  res
) => {
  const renderDetails = renderInfo || {}

  renderDetails.nexturl = path.substring(0, path.lastIndexOf('/'))
  renderDetails.backurl = `${path.substring(0, path.lastIndexOf('/'))}/diversity`

  if (body.diversity) {
    renderDetails.diversity = body.diversity
  } else {
    try {
      const comments = await getSentencePlanComments(planId, token)
      renderDetails.needtoknow = getCommentText(comments, 'THEIR_RESPONSIVITY')
    } catch (error) {
      logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
  return res.render(`${__dirname}/index`, { ...renderDetails, ...body, errors, errorSummary })
}

module.exports = { getNeedToKnow }
