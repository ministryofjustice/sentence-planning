const { postStatus } = require('./post.controller')

describe('postStatus', () => {
  describe('with a status selected', () => {
    it('should return the status', () => {
      const actionStatus = { status: 'IN_PROGRESS' }
      expect(postStatus(actionStatus)).toEqual(actionStatus)
    })
  })
})
