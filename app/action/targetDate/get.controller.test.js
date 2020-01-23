const { getTargetDate } = require('./get.controller')

describe('getTargetDate', () => {
  const action = { progress: [{ targetDate: '1972-05' }] }
  const body = { 'target-date-Month': '7', 'target-date-Year': '1973' }

  const returnBlank = {
    targetDateMonth: '',
    targetDateYear: '',
  }

  const returnAction = {
    targetDateMonth: '5',
    targetDateYear: '1972',
  }

  const returnBody = {
    targetDateMonth: '7',
    targetDateYear: '1973',
  }

  describe('a blank action', () => {
    it('should return blank values', () => {
      expect(getTargetDate({}, {})).toEqual(returnBlank)
    })
  })
  describe('a populated action only', () => {
    it('should return persisted values', () => {
      expect(getTargetDate(action, {})).toEqual(returnAction)
    })
  })
  describe('a populated body only', () => {
    it('should return the body values', () => {
      expect(getTargetDate({}, body)).toEqual(returnBody)
    })
  })
  describe('Values from the body should override persisted ones', () => {
    it('should return the body values', () => {
      expect(getTargetDate(action, body)).toEqual(returnBody)
    })
  })
})
