const { isEmptyObject } = require('./util')

const getCommentText = (comments, commentType) => {
  if (isEmptyObject(comments)) return false
  const comment = comments.find(({ commentType: type }) => type === commentType)
  return comment ? comment.comment : ''
}

module.exports = { getCommentText }
