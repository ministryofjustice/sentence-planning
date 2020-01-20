const { postMotivation } = require('./post.controller')

describe('postMotivation', () => {
  describe('with a motivation selected', () => {
    it('should return the motivationUIID', () => {
      const uuid = '3fa85f64-5717-4562-b3fc-2c963f66afa1'
      expect(postMotivation({ motivation: uuid })).toEqual({
        motivationUUID: uuid,
      })
    })
  })
})
