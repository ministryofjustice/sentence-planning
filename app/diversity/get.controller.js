const { logger } = require('../../common/logging/logger')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getDiversity = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId }, session: { 'x-auth-token': token } },
  res
) => {
  const renderDetails = renderInfo || {}
  let comments = ''
  renderDetails.backurl = path.substring(0, path.lastIndexOf('/'))

  if (body.diversity) {
    renderDetails.diversity = body.diversity
  } else {
    try {
      comments = await getSentencePlanComments(planId, token)
    } catch (error) {
      logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
      return res.render('app/error', { error })
    }
  }

  renderDetails.diversity = getCommentText(comments, 'YOUR_RESPONSIVITY')
  return res.render(`${__dirname}/index`, { ...renderDetails, ...body, errors, errorSummary })
}

module.exports = { getDiversity }
