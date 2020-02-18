const { logger } = require('../../../../common/logging/logger')
const { getSentencePlanComments } = require('../../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../../common/utils/getCommentText')

const getContactArrangements = async (
  { tokens, path, errors, errorSummary, body, renderInfo, params: { planId } },
  res
) => {
  const backurl = `${path.substring(0, path.lastIndexOf('/'))}#contact`
  try {
    let { contactArrangements } = body
    if (contactArrangements === undefined) {
      const comments = await getSentencePlanComments(planId, tokens)
      contactArrangements = getCommentText(comments, 'LIAISON_ARRANGEMENTS')
    }
    return res.render(`${__dirname}/index`, {
      ...body,
      errors,
      errorSummary,
      ...renderInfo,
      backurl,
      contactArrangements,
    })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getContactArrangements }
