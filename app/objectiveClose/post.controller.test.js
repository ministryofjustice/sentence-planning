const { postCloseObjective } = require('./post.controller')
const { updateSentencePlanObjectiveClose } = require('../../common/data/sentencePlanningApi')
const { getCloseObjective } = require('./get.controller')

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('./get.controller')

let req
let expected
const tokens = { authorisationToken: 'mytoken' }

beforeEach(() => {
  req = {
    path: 'individual-id/1/plan/2/objective/3/close',
    tokens,
    session: {},
    body: { closeReason: 'Objective is no longer relevant' },
    params: {
      planId: 2,
      objectiveId: 3,
    },
  }
  updateSentencePlanObjectiveClose.mockReset()
  getCloseObjective.mockReset()
  expected = {
    path: 'individual-id/1/plan/2#objectives',
    session: {},
    tokens,
    body: {
      closeReason: 'Objective is no longer relevant',
    },
    params: {
      planId: 2,
      objectiveId: 3,
    },
    errors: {
      errors: [
        {
          location: 'body',
          msg: 'Error message',
          param: 'closeReason',
          value: '',
        },
      ],
    },
  }
})

describe('post or update objective', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should close the objective when there are no errors', async () => {
    await postCloseObjective(req, res)
    expect(updateSentencePlanObjectiveClose).toHaveBeenCalledWith(
      2,
      3,
      { comment: 'Objective is no longer relevant' },
      tokens
    )
    expect(res.redirect).toHaveBeenCalledWith('individual-id/1/plan/2#objectives')
  })

  it('should redisplay the page when there are errors', async () => {
    expected.path = 'individual-id/1/plan/2/objective/3/close'
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'closeReason',
          location: 'body',
        },
      ],
    }
    await postCloseObjective(req, res)
    expect(updateSentencePlanObjectiveClose).not.toHaveBeenCalled()
    expect(getCloseObjective).toHaveBeenCalledWith(expected, res)
  })

  it('should display an error if objective closing fails', async () => {
    const theError = new Error('Error message')
    updateSentencePlanObjectiveClose.mockImplementation(() => {
      throw theError
    })
    await postCloseObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
