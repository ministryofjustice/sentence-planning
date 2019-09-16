const nock = require('nock')
const { getNamespace } = require('cls-hooked')
const config = require('../config')
const sentencePlanningClientBuilder = require('./sentencePlanningClientBuilder')

jest.mock('cls-hooked')

describe('sentencePlanningClient', () => {
  let fakeSentencePlanningAPI
  let sentencePlanningClient

  const token = 'token-1'

  beforeEach(() => {
    fakeSentencePlanningAPI = nock(config.apis.sentencePlanning.url)
    sentencePlanningClient = sentencePlanningClientBuilder(token)
    getNamespace.mockReturnValue({ get: () => 'myuser' })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getSentencePlans', () => {
    it('should return data from api', async () => {
      const sentencePlanningResponse = {}
      fakeSentencePlanningAPI
        .get(`/offender/418/sentenceplans/`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, sentencePlanningResponse)

      const output = await sentencePlanningClient.getSentencePlans('418')
      expect(output).toEqual(sentencePlanningResponse)
    })
  })

  describe('getSentencePlan', () => {
    it('should return a sentence plan', async () => {
      const sentencePlanningResponse = {
        oasysSetId: 11032,
        createdDate: '2012-10-16',
        completedDate: '2011-09-28',
        objectives: [
          {
            oasysCriminogenicNeeds: null,
            oasysInterventions: null,
            oasysObjectiveMeasure: null,
            objectiveType: {
              code: 'CURRENT',
              shortDescription: null,
              description: 'Current',
            },
            oasysWhoDoingWork: null,
            objectiveCode: '100',
            objectiveDescription: 'Increased ability to secure/maintain tenancy',
            howMeasured: 'regularly',
          },
        ],
      }
      fakeSentencePlanningAPI
        .get(`/sentenceplan/218`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, sentencePlanningResponse)

      const output = await sentencePlanningClient.getSentencePlan('218')
      expect(output).toEqual(sentencePlanningResponse)
    })
  })

  describe('getSentencePlanNeeds', () => {
    it('should return a sentence plans needs', async () => {
      const sentencePlanningResponse = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Alcohol',
          overThreshold: true,
          riskOfHarm: true,
          riskOfReoffending: false,
          flaggedAsNeed: false,
          active: false,
          motivation: null,
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Accommodation',
          overThreshold: true,
          riskOfHarm: true,
          riskOfReoffending: false,
          flaggedAsNeed: false,
          active: false,
          motivation: null,
        },
      ]
      fakeSentencePlanningAPI
        .get(`/sentenceplan/218/needs`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, sentencePlanningResponse)

      const output = await sentencePlanningClient.getSentencePlanNeeds('218')
      expect(output).toEqual(sentencePlanningResponse)
    })
  })

  describe('getSentencePlanStep', () => {
    it('should return a sentence plan step', async () => {
      const sentencePlanningResponse = {
        id: '11111111-1111-1111-1111-111111111111',
        owner: 'PRACTITIONER',
        ownerOther: '',
        description: 'description',
        strength: 'strength',
        status: 'COMPLETED',
        needs: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Alcohol',
            overThreshold: true,
            riskOfHarm: true,
            riskOfReoffending: false,
            flaggedAsNeed: false,
            active: false,
            motivation: null,
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Accommodation',
            overThreshold: true,
            riskOfHarm: true,
            riskOfReoffending: false,
            flaggedAsNeed: false,
            active: false,
            motivation: null,
          },
        ],
        intervention: null,
        priority: 0,
        progress: [],
        updated: null,
      }
      fakeSentencePlanningAPI
        .get(`/sentenceplan/218/steps/418`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, sentencePlanningResponse)

      const output = await sentencePlanningClient.getSentencePlanStep('218', '418')
      expect(output).toEqual(sentencePlanningResponse)
    })
  })
})
