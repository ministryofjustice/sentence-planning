const { logger } = require('../../../../common/logging/logger')
const { getSentencePlanComments } = require('../../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../../common/utils/getCommentText')

const getContactArrangements = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId }, headers: { 'x-auth-token': token } },
  res
) => {
  const renderDetails = renderInfo || {}
  renderDetails.backurl = `${path.substring(0, path.lastIndexOf('/'))}#contact`
  try {
    const comments = await getSentencePlanComments(planId, token)
    if (body.contactArrangements !== undefined) {
      renderDetails.contactArrangements = body.contactArrangements
    } else {
      renderDetails.contactArrangements = getCommentText(comments, 'LIAISON_ARRANGEMENTS')
    }
    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getContactArrangements }
