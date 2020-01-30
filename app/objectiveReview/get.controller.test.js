const { getObjectiveReview } = require('./get.controller')
const {
  getSentencePlanObjective,
  getInterventions,
  getMotivations,
  getSentencePlanNeeds,
} = require('../../common/data/sentencePlanningApi')
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

describe('getObjectiveReview', () => {
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const planId = '11111111-1111-1111-1111-111111111111'
  const objectiveId = '2222222-2222-2222-2222-222222222222'
  const token = 'token-1234'
  const req = {
    path: 'to/enlightenment/3/2/1',
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
    renderMock.mockReset()
  })

  describe('With fully populated objective data', () => {
    beforeEach(async () => {
      await getObjectiveReview(req, res)
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
    it('it should render the page', async () => {
      const expectedRenderDetails = {
        nexturl: 'to/enlightenment/3/2',
        backurl: 'to/enlightenment',
        errors: null,
        errorSummary: null,
        objective: objectiveMockData,
      }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expectedRenderDetails)
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
      await getObjectiveReview(req, res)
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
    it('it should render the page', async () => {
      const expectedRenderDetails = {
        nexturl: 'to/enlightenment/3/2',
        backurl: 'to/enlightenment',
        errors: null,
        errorSummary: null,
        objective: objectiveMockData,
      }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expectedRenderDetails)
    })
  })
  describe('With services throwing errors', () => {
    const error = new Error("Don't Panic")
    describe('errors being thrown when retrieving the objective', () => {
      beforeEach(async () => {
        getSentencePlanObjective.mockImplementation(mockPromise('', error))
        await getObjectiveReview(req, res)
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
        await getObjectiveReview(req, res)
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
        await getObjectiveReview(req, res)
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
        await getObjectiveReview(req, res)
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
    describe('errors being thrown when there are data erros', () => {
      beforeEach(async () => {
        getInterventions.mockImplementation(mockPromise([{ uuid: 'sausages', shortDescription: 'sausages' }]))
        await getObjectiveReview(req, res)
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
