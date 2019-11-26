const { editPlan } = require('./get.controller')

describe('getSentencePlanSummary', () => {
  const req = {
    params: {
      id: 1,
    },
    session: {
      'x-auth-token': '1234',
    },
  }
  const res = {
    render: jest.fn(),
  }

  describe('set up rendering', () => {
    it('should set the correct render values when there is an active plan', async () => {
      const expected = { id: 1, token: '1234' }
      await editPlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
