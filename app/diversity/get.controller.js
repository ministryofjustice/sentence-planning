const { logger } = require('../../common/logging/logger')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getDiversity = async ({ path, errors, errorSummary, body, renderInfo, params: { planId }, tokens }, res) => {
  const renderDetails = renderInfo || {}
  renderDetails.backurl = path.substring(0, path.lastIndexOf('/'))
  try {
    const comments = await getSentencePlanComments(planId, tokens)
    if (body.diversity !== undefined) {
      renderDetails.diversity = body.diversity
    } else {
      renderDetails.diversity = getCommentText(comments, 'YOUR_RESPONSIVITY')
    }
    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getDiversity }
