const { printSimplifiedSentencePlan } = require('./get.controller')

describe('printSimplifiedSentencePlan', () => {
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
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })

    // VVV - left in for future use
    // it('should display an error if plan is not available', async () => {
    //   const theError = new Error('Error message')
    //   getSentencePlanSummary.mockImplementation(() => {
    //     throw theError
    //   })
    //   await sentencePlanSummary(req, res)
    //   expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    // })
  })
})
