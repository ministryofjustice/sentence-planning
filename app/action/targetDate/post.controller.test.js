const { postTargetDate } = require('./post.controller')

describe('postTargetDate', () => {
  describe('with a month and a year', () => {
    it('should return an ISO 8601 timestamp', () => {
      expect(postTargetDate({ 'target-date-Month': '5', 'target-date-Year': '1972' })).toEqual({
        targetDate: '1972-05-01T00:00:00.000Z',
      })
    })
  })
})
