const { isEmptyObject } = require('./util')

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

module.exports = { getCommentText }
