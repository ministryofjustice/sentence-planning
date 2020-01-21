const { getStatus } = require('./get.controller')

describe('getStatus', () => {
  const actionStatus = { status: 'NOT_STARTED' }
  const bodyStatus = { status: 'IN_PROGRESS' }

  describe('a blank action', () => {
    it('should return the status', () => {
      expect(getStatus({}, {})).toEqual({ status: '' })
    })
  })
  describe('should return persisted values', () => {
    it('should return the processed motivationList', () => {
      expect(getStatus(actionStatus, {})).toEqual(actionStatus)
    })
  })
  describe('Values from the body should override persisted ones', () => {
    it('should return the processed body values', () => {
      expect(getStatus(actionStatus, bodyStatus)).toEqual(bodyStatus)
    })
  })
})
