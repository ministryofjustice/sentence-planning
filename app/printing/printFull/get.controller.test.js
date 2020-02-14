const { printFullSentencePlan } = require('./get.controller')

describe('printFullSentencePlan', () => {
  const req = {
    path: 'lead/me/up/the/garden/path',
    params: {
      id: 1,
    },
    headers: {
      'x-auth-token': '1234',
    },
  }
  const res = {
    render: jest.fn(),
  }

  describe('show print page', () => {
    it('should set the correct render values n', async () => {
      const expected = {
        backUrl: 'lead/me/up/the/garden',
      }
      await printFullSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it.skip('should display an error if comments are not available', async () => {
      const theError = new Error('Error message')
      getSentencePlanSummary.mockImplementation(() => {
        throw theError
      })
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
