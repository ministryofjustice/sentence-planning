const { getObjectiveData } = require('./getObjectiveData')
const {
  getSentencePlanObjective,
  getInterventions,
  getMotivations,
  getSentencePlanNeeds,
} = require('../data/sentencePlanningApi')
const interventionsMockData = require('../../mockServer/interventions/interventions.json')
const motivationsMockData = require('../../mockServer/motivations/motivations.json')
const needsMock = require('../../mockServer/sentencePlanNeeds/1.json')
const objectiveMockDataJSON = JSON.stringify(require('../../mockServer/sentencePlanObjectives/1.json'))

jest.mock('../../common/data/sentencePlanningApi', () => ({
  getSentencePlanObjective: jest.fn(),
  getInterventions: jest.fn(),
  getMotivations: jest.fn(),
  getSentencePlanNeeds: jest.fn(),
}))

describe('getObjectiveData', () => {
  const next = jest.fn()
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const planId = '11111111-1111-1111-1111-111111111111'
  const objectiveId = '2222222-2222-2222-2222-222222222222'
  const token = 'token-1234'
  const req = {
    errors: null,
    errorSummary: null,
    params: { planId, objectiveId },
    headers: { 'x-auth-token': token },
  }
  const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

  let objectiveMockData
  beforeEach(() => {
    objectiveMockData = JSON.parse(objectiveMockDataJSON)
    getSentencePlanObjective.mockImplementation(mockPromise(objectiveMockData))
    getInterventions.mockImplementation(mockPromise(interventionsMockData))
    getMotivations.mockImplementation(mockPromise(motivationsMockData))
    getSentencePlanNeeds.mockImplementation(mockPromise(needsMock))
  })

  afterEach(() => {
    getSentencePlanObjective.mockReset()
    getInterventions.mockReset()
    getMotivations.mockReset()
    getSentencePlanNeeds.mockReset()
    next.mockReset()
    renderMock.mockReset()
  })

  describe('With fully populated objective data', () => {
    beforeEach(async () => {
      await getObjectiveData(req, res, next)
    })
    it('it should request the sentence plan objective', async () => {
      expect(getSentencePlanObjective).toHaveBeenCalledWith(planId, objectiveId, token)
    })
    it('it should request the intervention data', async () => {
      expect(getInterventions).toHaveBeenCalledWith(token)
    })
    it('it should request the motivation data', async () => {
      expect(getMotivations).toHaveBeenCalledWith(token)
    })
    it('it should request the needs data', async () => {
      expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, token)
    })
    it('it should populate the renderInfo', async () => {
      const expectedRenderDetails = {
        errors: null,
        errorSummary: null,
        objective: objectiveMockData,
      }
      expect(req.renderInfo).toMatchObject(expectedRenderDetails)
    })
    it('it should move on to the next middleware', async () => {
      expect(next).toHaveBeenCalled()
    })
  })
  describe('With objective data with no needs or interventions', () => {
    beforeEach(async () => {
      objectiveMockData.needs = null
      objectiveMockData.actions = objectiveMockData.actions.map(action => ({
        ...action,
        intervention: '',
        description: 'an action',
      }))
      await getObjectiveData(req, res, next)
    })
    it('it should request the sentence plan objective', async () => {
      expect(getSentencePlanObjective).toHaveBeenCalledWith(planId, objectiveId, token)
    })
    it('it should not request the intervention data', async () => {
      expect(getInterventions).not.toHaveBeenCalled()
    })
    it('it should request the motivation data', async () => {
      expect(getMotivations).toHaveBeenCalledWith(token)
    })
    it('it should not request the needs data', async () => {
      expect(getSentencePlanNeeds).not.toHaveBeenCalled()
    })
    it('it should populate the renderInfo', async () => {
      const expectedRenderDetails = {
        errors: null,
        errorSummary: null,
        objective: objectiveMockData,
      }
      expect(req.renderInfo).toMatchObject(expectedRenderDetails)
    })
    it('it should move on to the next middleware', async () => {
      expect(next).toHaveBeenCalled()
    })
  })
  describe('With services throwing errors', () => {
    const error = new Error("Don't Panic")
    describe('errors being thrown when retrieving the objective', () => {
      beforeEach(async () => {
        getSentencePlanObjective.mockImplementation(mockPromise('', error))
        await getObjectiveData(req, res, next)
      })
      it('it should request the sentence plan objective', async () => {
        expect(getSentencePlanObjective).toHaveBeenCalledWith(planId, objectiveId, token)
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
    describe('errors being thrown when retrieving the interventions', () => {
      beforeEach(async () => {
        getInterventions.mockImplementation(mockPromise('', error))
        await getObjectiveData(req, res, next)
      })
      it('it should request the interventions', async () => {
        expect(getInterventions).toHaveBeenCalledWith(token)
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
    describe('errors being thrown when retrieving the motivations', () => {
      beforeEach(async () => {
        getMotivations.mockImplementation(mockPromise('', error))
        await getObjectiveData(req, res, next)
      })
      it('it should request the motivations', async () => {
        expect(getMotivations).toHaveBeenCalledWith(token)
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
    describe('errors being thrown when retrieving the needs', () => {
      beforeEach(async () => {
        getSentencePlanNeeds.mockImplementation(mockPromise('', error))
        await getObjectiveData(req, res, next)
      })
      it('it should request the needs', async () => {
        expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, token)
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
    describe('errors being thrown when there are data errors', () => {
      beforeEach(async () => {
        getInterventions.mockImplementation(mockPromise([{ uuid: 'sausages', shortDescription: 'sausages' }]))
        await getObjectiveData(req, res, next)
      })
      it('it should request the needs', async () => {
        expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, token)
      })
      it('should render the error page', async () => {
        expect(renderMock).toHaveBeenCalledWith(
          'app/error',
          expect.objectContaining({
            error: expect.objectContaining({ message: expect.any(String) }),
          })
        )
      })
    })
  })
})