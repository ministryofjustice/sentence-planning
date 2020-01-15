const { postActionDescriptionIntervention } = require('./post.controller')

describe('postActionDescriptionIntervention', () => {
  const bodyIntervention = { actionType: 'intervention', intervention: 'Intervention', description: 'Description' }
  const bodyDescription = { actionType: 'description', intervention: 'Intervention', description: 'Description' }

  const returnIntervention = { intervention: 'Intervention', description: '' }
  const returnDescription = { intervention: '', description: 'Description' }

  describe('with the intervention button selected', () => {
    it('should return the intervention and discard the description', () => {
      expect(postActionDescriptionIntervention(bodyIntervention)).toEqual(returnIntervention)
    })
  })
  describe('with the description button selected', () => {
    it('should return the description and discard the intervention', () => {
      expect(postActionDescriptionIntervention(bodyDescription)).toEqual(returnDescription)
    })
  })
})
