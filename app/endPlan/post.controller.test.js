const { postEndPlan } = require('./post.controller')
const { endSentencePlan } = require('../../common/data/sentencePlanningApi')

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
  endSentencePlan.mockReset()
})

describe('start sentence plan', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should start the plan when there are no errors', async () => {
    await postEndPlan(req, res)
    expect(endSentencePlan).toHaveBeenCalledWith(123, '1234')
    expect(res.redirect).toHaveBeenCalledWith('/individual-id/456/plans')
  })

  it('should display an error if plan starting fails', async () => {
    const theError = new Error('Error message')
    endSentencePlan.mockImplementation(() => {
      throw theError
    })
    await postEndPlan(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
