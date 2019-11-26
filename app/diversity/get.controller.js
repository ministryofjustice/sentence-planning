const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getDiversity = async (
  { path, errors, errorSummary, body, renderInfo, params: { planid }, session: { 'x-auth-token': token } },
  res
) => {
  let renderDetails = renderInfo
  if (!renderInfo) {
    renderDetails = {}
  }
  renderDetails.backurl = path.substring(0, path.lastIndexOf('/'))

  if (body.diversity) {
    renderDetails.diversity = body.diversity
  } else {
    const comments = await getSentencePlanComments(planid, token)
    renderDetails.diversity = getCommentText(comments, 'YOUR_RESPONSIVITY')
  }

  res.render(`${__dirname}/index`, { ...renderDetails, ...body, errors, errorSummary })
}

module.exports = { getDiversity }
