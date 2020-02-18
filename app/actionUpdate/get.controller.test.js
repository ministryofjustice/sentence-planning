const { getActionUpdate } = require('./get.controller')
const { getSentencePlanObjectiveAction, getInterventions } = require('../../common/data/sentencePlanningApi')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getMotivation } = require('../partials/motivations/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')

const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('../partials/targetDate/get.controller')
jest.mock('../partials/motivations/get.controller')
jest.mock('../partials/responsibility/get.controller')
jest.mock('../partials/status/get.controller')

const interventionText = 'Violence booster'
const descriptionText = 'Something wholesome'

describe('getActionUpdate', () => {
  let req
  let res
  let expected
  const token = {
    authorisationToken: 'mytoken',
  }
  beforeEach(() => {
    getInterventions.mockImplementation(
      mockPromise([{ shortDescription: interventionText, uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa4' }])
    )
    getTargetDate.mockImplementation(() => ({ targetDateMonth: '', targetDateYear: '' }))
    getMotivation.mockImplementation(mockPromise({ motivationList: [] }))
    getResponsibility.mockImplementation(() => ({ responsibility: ['OTHER'], responsibilityOther: '' }))
    getStatus.mockImplementation(() => ({ status: 'NOT_STARTED' }))
    req = {
      path: '/this/is/my/path',
      params: {
        planId: 1,
        objectiveId: '202',
        actionId: '1',
      },
      tokens: token,
      body: {},
      errors: {},
      errorSummary: {},
    }
    res = {
      render: jest.fn(),
    }
    expected = {
      backUrl: '/this/is',
      errorSummary: {},
      errors: {},
      actionText: interventionText,
      targetDateMonth: '',
      targetDateYear: '',
      motivationList: [],
      responsibility: ['OTHER'],
      responsibilityOther: '',
      status: 'NOT_STARTED',
    }
  })

  afterEach(() => {
    delete req.body.action
    jest.resetAllMocks()
  })
  describe('with an intervention', () => {
    beforeEach(() => {
      getSentencePlanObjectiveAction.mockImplementation(
        mockPromise({
          description: '',
          intervention: '3fa85f64-5717-4562-b3fc-2c963f66afa4',
          motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          owner: ['SERVICE_USER'],
          ownerOther: 'string',
          status: 'NOT_STARTED',
          targetDate: '2022-04',
        })
      )
    })
    it('should get the correct render values and display an intervention', async () => {
      await getActionUpdate(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should display an error if unable to retrieve action', async () => {
      req.params.actionId = '1'
      const theError = new Error('Error message')
      getSentencePlanObjectiveAction.mockImplementation(() => {
        throw theError
      })
      await getActionUpdate(req, res)
      expect(res.render).toHaveBeenCalledWith(
        `app/error`,
        expect.objectContaining({
          error: expect.objectContaining({ message: expect.stringContaining(theError.toString()) }),
        })
      )
    })
  })
  describe('with a description action', () => {
    beforeEach(() => {
      getSentencePlanObjectiveAction.mockImplementation(
        mockPromise({
          description: descriptionText,
          intervention: '',
          motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          owner: ['SERVICE_USER'],
          ownerOther: 'string',
          status: 'NOT_STARTED',
          targetDate: '2022-04',
        })
      )
      expected.actionText = descriptionText
    })
    it('should get the correct render values and display the description action', async () => {
      await getActionUpdate(req, res)
      expect(getInterventions).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
