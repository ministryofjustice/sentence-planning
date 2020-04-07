const { getActionData } = require('./getActionData')
const { getSentencePlanObjectiveAction, getInterventions } = require('../../common/data/sentencePlanningApi')
const { getMotivation } = require('../../app/partials/motivations/get.controller')
const interventionsMockData = require('../../mockServer/interventions/interventions.json')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  getSentencePlanObjectiveAction: jest.fn(),
  getInterventions: jest.fn(),
}))
jest.mock('../../app/partials/motivations/get.controller')

const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

describe('getActionData', () => {
  let req
  let res
  const next = jest.fn()
  const renderMock = jest.fn()
  let actionMockData
  const planId = '11111111-1111-1111-1111-111111111111'
  const objectiveId = '22222222-2222-2222-2222-222222222222'
  const actionId = '33333333-3333-3333-3333-333333333333'
  const tokens = { authorisationToken: 'myToken' }
  beforeEach(() => {
    req = {
      errors: null,
      errorSummary: null,
      params: { planId, objectiveId, actionId },
      tokens,
    }
    res = {
      render: renderMock,
    }
    actionMockData = {
      description: '',
      id: '1',
      intervention: '3fa85f64-5717-4562-b3fc-2c963f66afa4',
      motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      owner: ['SERVICE_USER'],
      ownerOther: 'string',
      priority: 0,
      progress: [
        {
          comment: 'string',
          created: '2019-12-16T11:51:29.032Z',
          createdBy: 'string',
          motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa4',
          status: 'NOT_STARTED',
          targetDate: '2022-05',
        },
      ],
      status: 'NOT_STARTED',
      updated: '2019-12-16T11:51:29.032Z',
    }
    getSentencePlanObjectiveAction.mockImplementation(mockPromise(actionMockData))
    getInterventions.mockImplementation(mockPromise(interventionsMockData))
    getMotivation.mockImplementation(mockPromise({ motivationList: [] }))
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('with complete action data', () => {
    beforeEach(async () => {
      await getActionData(req, res, next)
    })
    it('should call the data sources', () => {
      expect(getSentencePlanObjectiveAction).toHaveBeenCalled()
    })
    it('should append the data to the request object', () => {
      expect(req.action).toBe(actionMockData)
    })
    it('should call next', () => {
      expect(next).toHaveBeenCalled()
      expect(renderMock).not.toHaveBeenCalled()
    })
  })
  describe('with incomplete action data', () => {
    const error = new Error("Don't Panic")
    beforeEach(async () => {
      getSentencePlanObjectiveAction.mockImplementation(mockPromise('', error))
      await getActionData(req, res, next)
    })
    it('should not call next with the error', () => {
      expect(next).not.toHaveBeenCalled()
    })
    it('should render the error page', async () => {
      expect(renderMock).toHaveBeenCalledWith(
        'app/error',
        expect.objectContaining({
          error: expect.objectContaining({ message: expect.stringContaining(error.toString()) }),
        })
      )
    })
  })
})
