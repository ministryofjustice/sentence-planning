const { postResponsibility } = require('./post.controller')

describe('postResponsibility', () => {
  const responsibilityOther = 'Harold Skimpole'
  describe('with an owner', () => {
    it('should return the responsibility', () => {
      expect(postResponsibility({ responsibility: 'SERVICE_USER', responsibilityOther })).toEqual({
        owner: ['SERVICE_USER'],
        ownerOther: '',
      })
    })
  })
  describe('with an other owner', () => {
    it('should return the other responsibility', () => {
      const responsibility = ['SERVICE_USER', 'OTHER']
      expect(postResponsibility({ responsibility, responsibilityOther })).toEqual({
        owner: responsibility,
        ownerOther: responsibilityOther,
      })
    })
  })
})
