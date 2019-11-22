const controller = require('./get.controller')

const { getSentencePlanSummary } = require('../../common/data/offenderSentencePlanSummary')

jest.mock('../../common/data/offenderSentencePlanSummary.js', () => ({
  getSentencePlanSummary: jest.fn(),
}))

describe.skip('getSentencePlanSummary', () => {
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

  it('should set the correct render values when there is an active plan', async () => {
    req.params.id = 1
    getSentencePlanSummary.mockReturnValueOnce(activePlan)
    const expected = { activePlan: true, individualId: 1 }
    await controller.sentencePlanSummary(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when there is no active plan', async () => {
    req.params.id = 11034
    getSentencePlanSummary.mockReturnValueOnce(noActivePlan)
    const expected = { activePlan: false, individualId: 11034 }
    await controller.sentencePlanSummary(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
})
