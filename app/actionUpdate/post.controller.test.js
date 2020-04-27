const { postActionUpdate } = require('./post.controller')
const { addSentencePlanObjectiveActionProgress } = require('../../common/data/sentencePlanningApi')

const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('../partials/targetDate/post.controller', () => ({
  postTargetDate: jest.fn(() => ({ targetDate: '2020-09' })),
}))
jest.mock('../partials/responsibility/post.controller', () => ({
  postResponsibility: jest.fn(() => ({ owner: ['SERVICE_USER'], ownerOther: '' })),
}))

let req
let res

const token = {
  authorisationToken: 'mytoken',
}
const planId = '1'
const objectiveId = '2'
const actionId = '404'
const progress = {
  comment: 'Raindrops on roses, And whiskers on kittens...',
  motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  owner: ['SERVICE_USER'],
  ownerOther: '',
  status: 'IN_PROGRESS',
  targetDate: '2020-09',
}
const next = jest.fn()

beforeEach(() => {
  req = {
    path: '/this/is/my/path',
    params: {
      planId,
      objectiveId,
      actionId,
    },
    tokens: token,
    body: {
      comment: progress.comment,
      motivation: progress.motivationUUID,
      status: progress.status,
    },
    renderInfo: null,
  }
  addSentencePlanObjectiveActionProgress.mockReset()

  res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('add progress', () => {
  describe('when the user wants to progress an action', () => {
    beforeEach(() => {
      addSentencePlanObjectiveActionProgress.mockImplementation(mockPromise({}))
      req.body.addAnotherAction = ''
    })
    it('should save the new progress when there are no errors', async () => {
      await postActionUpdate(req, res, next)
      expect(addSentencePlanObjectiveActionProgress).toHaveBeenCalledWith(
        planId,
        objectiveId,
        actionId,
        progress,
        token
      )
      expect(res.redirect).toHaveBeenCalledWith('/this/is')
    })

    it('should redisplay the page when there are errors', async () => {
      req.errors = {
        errors: [
          {
            value: '',
            msg: 'Error message',
            param: 'action',
            location: 'body',
          },
        ],
      }
      await postActionUpdate(req, res, next)
      expect(addSentencePlanObjectiveActionProgress).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })
  describe('when an error occurs persisting progress', () => {
    const theError = new Error('Error message')

    beforeEach(() => {
      addSentencePlanObjectiveActionProgress.mockImplementation(mockPromise({}, theError))
      req.body.addAnotherAction = ''
    })
    it('should display an error if action saving fails', async () => {
      await postActionUpdate(req, res, next)
      expect(addSentencePlanObjectiveActionProgress).toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        `app/error`,
        expect.objectContaining({
          error: expect.objectContaining({ message: expect.stringContaining(theError.toString()) }),
        })
      )
    })
  })
})
