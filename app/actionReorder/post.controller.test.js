const { postActionReorder } = require('./post.controller')
const { setActionPriorities } = require('../../common/data/sentencePlanningApi')
const { logger } = require('../../common/logging/logger')

const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('./get.controller')
jest.mock('../../common/logging/logger', () => ({ logger: { error: jest.fn() } }))

describe('postActionReorder', () => {
  let req
  let res

  const token = {
    authorisationToken: 'mytoken',
  }
  const planId = '1'
  const objectiveId = '2'

  beforeEach(() => {
    req = {
      path: '/this/is/my/path',
      params: {
        planId,
        objectiveId,
      },
      tokens: token,
      body: {
        'e2de57e6-d1b0-4e89-ade6-15dd437ca84d': 1,
        'e2de57e6-d1b0-4e89-ade6-15dd437ca84e': 3,
        'e2de57e6-d1b0-4e89-ade6-15dd437ca84f': 2,
        'e2de57e6-d1b0-4e89-ade6-15dd437ca84c': 4,
      },
      renderInfo: null,
    }
    setActionPriorities.mockReset()
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('when validation errors are present', () => {
    const ERROR1 = 'Priority values should all be integers. Priority values are not unique'
    const ERROR2 = 'is everything'
    beforeEach(async () => {
      req.errors = {
        body: { text: ERROR1 },
        con: { text: ERROR2 },
      }
      await postActionReorder(req, res)
    })
    it('should render the error page', () => {
      expect(res.render).toHaveBeenCalledWith(`app/error`, {
        error: 'An error occurred when trying to reorder the objective actions.',
      })
    })
    it('should log out each error', () => {
      expect(logger.error).toHaveBeenCalledTimes(2)
      expect(logger.error).toHaveBeenCalledWith(`body: ${ERROR1}`)
      expect(logger.error).toHaveBeenCalledWith(`con: ${ERROR2}`)
    })
  })
  describe('when the user wants to reorder an objectives actions', () => {
    beforeEach(() => {
      setActionPriorities.mockImplementation(mockPromise({}))
      req.body.addAnotherAction = ''
    })
    it('should save the new priorities when there are no errors', async () => {
      await postActionReorder(req, res)
      expect(setActionPriorities).toHaveBeenCalledWith(
        planId,
        objectiveId,
        [
          { actionUUID: 'e2de57e6-d1b0-4e89-ade6-15dd437ca84d', priority: 1 },
          { actionUUID: 'e2de57e6-d1b0-4e89-ade6-15dd437ca84e', priority: 3 },
          { actionUUID: 'e2de57e6-d1b0-4e89-ade6-15dd437ca84f', priority: 2 },
          { actionUUID: 'e2de57e6-d1b0-4e89-ade6-15dd437ca84c', priority: 4 },
        ],
        token
      )
      expect(res.redirect).toHaveBeenCalledWith('/this/is/my')
    })
  })
  describe('when an error occurs persisting priorities', () => {
    const theError = new Error('Error message')

    beforeEach(() => {
      setActionPriorities.mockImplementation(mockPromise({}, theError))
      req.body.addAnotherAction = ''
    })
    it('should display an error if action saving fails', async () => {
      await postActionReorder(req, res)
      expect(setActionPriorities).toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        `app/error`,
        expect.objectContaining({
          error: expect.objectContaining({ message: expect.stringContaining(theError.toString()) }),
        })
      )
    })
  })
})
