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
const objectiveSourceJSON = JSON.stringify(require('./testSupportFiles/getObjectiveData_source.json'))
const objectiveExpectedJSON = JSON.stringify(require('./testSupportFiles/getObjectiveData_expected.json'))

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
  const tokens = { authorisationToken: 'mytoken' }
  const req = {
    errors: null,
    errorSummary: null,
    params: { planId, objectiveId },
    tokens,
  }
  const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

  let objectiveMockData
  let objectiveExpectedData
  beforeEach(() => {
    objectiveMockData = JSON.parse(objectiveSourceJSON)
    objectiveExpectedData = JSON.parse(objectiveExpectedJSON)
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
      expect(getSentencePlanObjective).toHaveBeenCalledWith(planId, objectiveId, tokens)
    })
    it('it should request the intervention data', async () => {
      expect(getInterventions).toHaveBeenCalledWith(tokens)
    })
    it('it should request the motivation data', async () => {
      expect(getMotivations).toHaveBeenCalledWith(tokens)
    })
    it('it should request the needs data', async () => {
      expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, tokens)
    })
    it('it should populate the renderInfo', async () => {
      const expectedRenderDetails = {
        errors: null,
        errorSummary: null,
        objective: objectiveExpectedData,
      }
      expect(req.renderInfo).toMatchObject(expectedRenderDetails)
    })
    it('it should move on to the next middleware', async () => {
      expect(next).toHaveBeenCalled()
    })
  })

  describe('With no needs being returned', () => {
    beforeEach(async () => {
      getSentencePlanNeeds.mockImplementation(mockPromise([]))
      await getObjectiveData(req, res, next)
    })
    it('it should request the needs data', async () => {
      expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, tokens)
    })
    it('it should populate the renderInfo with no needs', async () => {
      expect(req.renderInfo.objective.needs).toEqual([])
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
      objectiveExpectedData.actions = objectiveExpectedData.actions.map(
        ({ id, motivation, targetDate, owner, status }) => ({
          id,
          motivation,
          targetDate,
          owner,
          status,
          actionText: 'an action',
        })
      )
      await getObjectiveData(req, res, next)
    })
    it('it should request the sentence plan objective', async () => {
      expect(getSentencePlanObjective).toHaveBeenCalledWith(planId, objectiveId, tokens)
    })
    it('it should not request the intervention data', async () => {
      expect(getInterventions).not.toHaveBeenCalled()
    })
    it('it should request the motivation data', async () => {
      expect(getMotivations).toHaveBeenCalledWith(tokens)
    })
    it('it should not request the needs data', async () => {
      expect(getSentencePlanNeeds).not.toHaveBeenCalled()
    })
    it('it should populate the renderInfo', async () => {
      const expectedRenderDetails = {
        errors: null,
        errorSummary: null,
        objective: objectiveExpectedData,
      }
      objectiveExpectedData.needs = []
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
        expect(getSentencePlanObjective).toHaveBeenCalledWith(planId, objectiveId, tokens)
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
        expect(getInterventions).toHaveBeenCalledWith(tokens)
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
        expect(getMotivations).toHaveBeenCalledWith(tokens)
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
        expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, tokens)
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
        expect(getSentencePlanNeeds).toHaveBeenCalledWith(planId, tokens)
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
