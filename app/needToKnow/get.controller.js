const { logger } = require('../../common/logging/logger')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getNeedToKnow = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId }, headers: { 'x-auth-token': token } },
  res
) => {
  const renderDetails = renderInfo || {}

  renderDetails.nexturl = path.substring(0, path.lastIndexOf('/'))
  renderDetails.backurl = `${path.substring(0, path.lastIndexOf('/'))}/diversity`

  try {
    if (body.needtoknow !== undefined) {
      renderDetails.needtoknow = body.needtoknow
    } else {
      const comments = await getSentencePlanComments(planId, token)
      renderDetails.needtoknow = getCommentText(comments, 'THEIR_RESPONSIVITY')
    }
    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getNeedToKnow }
