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

  describe('getLegacySentencePlan', () => {
    it('should return a legacy sentence plan', async () => {
      const legacySP = {
        id: '11111111-1111-1111-1111-111111111111',
        needs: [],
        steps: [],
      }
      fakeSentencePlanningAPI
        .get(`/offender/418/sentenceplan/218`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, legacySP)

      const output = await sentencePlanningClient.getLegacySentencePlan('418', '218')
      expect(output).toEqual(legacySP)
    })
  })

  describe('createSentencePlan', () => {
    it('should return a new sentence plan', async () => {
      const sentencePlan = {
        childSafeguardingIndicated: true,
        comments: [],
        complyWithChildProtectionPlanIndicated: true,
        createdOn: '2019-09-23T09:24:13.446Z',
        id: 'string',
        needs: [],
        offender: {
          nomisBookingNumber: 0,
          oasysOffenderId: 0,
        },
        serviceUserComments: 'string',
        status: 'STARTED',
        steps: [],
      }
      fakeSentencePlanningAPI
        .post(`/sentenceplan`, { offenderId: '418', offenderReferenceType: 'OASYS' })
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, sentencePlan)

      const output = await sentencePlanningClient.createSentencePlan('418')
      expect(output).toEqual(sentencePlan)
    })
  })

  describe('updateServiceUserComments', () => {
    it('should update the sentence plans "serviceUserComment" field', async () => {
      const serviceUserComment = 'sausages'
      fakeSentencePlanningAPI
        .post(`/sentenceplan/418/serviceUserComments`, serviceUserComment)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, {})

      const output = await sentencePlanningClient.updateServiceUserComments('418', serviceUserComment)
      expect(output).toEqual({})
    })
  })
})
