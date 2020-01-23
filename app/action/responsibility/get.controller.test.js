const { getResponsibility } = require('./get.controller')

describe('getResponsibility', () => {
  const actionResponsibility = { owner: ['SERVICE_USER', 'PRACTITIONER'], ownerOther: '' }
  const expectedResponsibility = { responsibility: ['SERVICE_USER', 'PRACTITIONER'], responsibilityOther: '' }
  const bodyResponsibility = { responsibility: ['OTHER'], responsibilityOther: 'the milkman' }

  describe('a blank action', () => {
    it('should return the responsibility', () => {
      expect(getResponsibility({}, {})).toEqual({ responsibility: [], responsibilityOther: '' })
    })
  })
  describe('should return persisted values', () => {
    it('should return the processed responsibility', () => {
      expect(getResponsibility(actionResponsibility, {})).toEqual(expectedResponsibility)
    })
  })
  describe('Values from the body should override persisted ones', () => {
    it('should return the processed body values', () => {
      expect(getResponsibility(actionResponsibility, bodyResponsibility)).toEqual(bodyResponsibility)
    })
  })
})
