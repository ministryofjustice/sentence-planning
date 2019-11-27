const { getCommentText } = require('./getCommentText')
const comments = require('../../mockServer/sentencePlanComments/1.json')

describe('return comment text of correct commentType', () => {
  it('should return comment text with the correct type', () => {
    expect(getCommentText(comments, 'YOUR_RESPONSIVITY')).toEqual('My responsivity comment')
    expect(getCommentText(comments, 'THEIR_RESPONSIVITY')).toEqual('Their responsivity comment')
  })
  it('should return empty string if no such type exists', () => {
    expect(getCommentText(comments, 'NOT_A_VALID_TYPE')).toEqual('')
  })
})
