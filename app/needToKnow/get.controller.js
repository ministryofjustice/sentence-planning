const { getSentencePlanComments } = require('../../common/data/sentencePlanComments')
const { isEmptyObject } = require('../../common/utils/util')

const getCommentText = (comments, commentType) => {
  if (isEmptyObject(comments)) return false
  let commentText = ''
  comments.forEach(comment => {
    if (comment.commentType === commentType) {
      commentText = comment.comment
    }
  })
  return commentText
}

const getNeedToKnow = async ({ path, params: { planid }, session: { 'x-auth-token': token } }, res) => {
  // get previously saved value for diversity comment
  const comments = await getSentencePlanComments(planid, token)

  const renderInfo = {}
  renderInfo.nexturl = path.substring(0, path.lastIndexOf('/'))
  renderInfo.backurl = `${path.substring(0, path.lastIndexOf('/'))}/diversity`
  renderInfo.needtoknow = getCommentText(comments, 'THEIR_RESPONSIVITY')

  res.render(`${__dirname}/index`, { ...renderInfo })
}

module.exports = { getNeedToKnow }
