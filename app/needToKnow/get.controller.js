const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getNeedToKnow = async (
  { path, errors, errorSummary, body, renderInfo, params: { planid }, session: { 'x-auth-token': token } },
  res
) => {
  let renderDetails = renderInfo
  if (!renderInfo) {
    renderDetails = {}
  }

  renderDetails.nexturl = path.substring(0, path.lastIndexOf('/'))
  renderDetails.backurl = `${path.substring(0, path.lastIndexOf('/'))}/diversity`

  if (body.diversity) {
    renderDetails.diversity = body.diversity
  } else {
    const comments = await getSentencePlanComments(planid, token)
    renderDetails.needtoknow = getCommentText(comments, 'THEIR_RESPONSIVITY')
  }
  res.render(`${__dirname}/index`, { ...renderDetails, ...body, errors, errorSummary })
}

module.exports = { getNeedToKnow }
