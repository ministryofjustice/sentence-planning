const nock = require('nock')
const summaryPlansResponse = require('../../mockServer/sentencePlanSummary/11034.json')
const summaryPlanResponse = require('../../mockServer/sentencePlanSummary/11034.json')

const {
  apis: {
    sentencePlanning: { url },
  },
} = require('../config')
const { getSentencePlanSummary, createSentencePlan } = require('./sentencePlanningApi')

describe('sentencePlanningApi', () => {
  beforeEach(() => {
    mockedEndpoint = nock(url)
  })
  afterEach(() => {
    nock.cleanAll()
  })
  let mockedEndpoint
  const token = '1234'
  const id = '123458'

  describe('getSentencePlanSummary', () => {
    const sentencePlansUrl = `/offenders/${id}/sentenceplans`

    it('should return sentence plan summary data', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(200, summaryPlansResponse)
      const output = await getSentencePlanSummary(id, token)
      expect(output).toEqual(summaryPlansResponse)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(400)
      await expect(getSentencePlanSummary(id, token)).rejects.toThrowError('Bad Request')
    })
  })

  describe('createSentencePlan', () => {
    const sentencePlanUrl = `/sentenceplan`
    const expectedBody = { offenderId: id, offenderReferenceType: 'OASYS' }

    it('should return new sentence plan data', async () => {
      mockedEndpoint.post(sentencePlanUrl, expectedBody).reply(200, summaryPlanResponse)
      const output = await createSentencePlan(id, token)
      expect(output).toEqual(summaryPlanResponse)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlanUrl, expectedBody).reply(400)
      await expect(createSentencePlan(id, token)).rejects.toThrowError('Bad Request')
    })
  })
})
