const { postStartPlan } = require('./post.controller')
const { startSentencePlan } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

let req

beforeEach(() => {
  req = {
    params: {
      planId: 123,
      id: 456,
    },
    session: {
      'x-auth-token': '1234',
    },
  }
  startSentencePlan.mockReset()
})

describe('start sentence plan', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should start the plan when there are no errors', async () => {
    await postStartPlan(req, res)
    expect(startSentencePlan).toHaveBeenCalledWith(123, '1234')
    expect(res.redirect).toHaveBeenCalledWith('/individual-id/456/plan/123')
  })

  it('should display an error if plan starting fails', async () => {
    const theError = new Error('Error message')
    startSentencePlan.mockImplementation(() => {
      throw theError
    })
    await postStartPlan(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
