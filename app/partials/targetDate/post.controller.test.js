const { postTargetDate } = require('./post.controller')

describe('postTargetDate', () => {
  describe('with a single digit month and a year', () => {
    it('should return an YYYY-MM timestamp', () => {
      expect(postTargetDate({ 'target-date-Month': '5', 'target-date-Year': '1972' })).toEqual({
        targetDate: '1972-05',
      })
    })
  })
  describe('with a double digit month and a year', () => {
    it('should return an YYYY-MM timestamp', () => {
      expect(postTargetDate({ 'target-date-Month': '10', 'target-date-Year': '1972' })).toEqual({
        targetDate: '1972-10',
      })
    })
  })
})
