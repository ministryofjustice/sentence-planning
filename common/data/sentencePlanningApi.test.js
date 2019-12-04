const nock = require('nock')
const summaryPlanResponse = require('../../mockServer/sentencePlanSummary/11034.json')
const sentencePlanComments = require('../../mockServer/sentencePlanComments/1.json')

const {
  apis: {
    sentencePlanning: { url },
  },
} = require('../config')
const {
  getSentencePlanSummary,
  createSentencePlan,
  getSentencePlanComments,
  setSentencePlanComment,
} = require('./sentencePlanningApi')

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
      mockedEndpoint.get(sentencePlansUrl).reply(200, summaryPlanResponse)
      const output = await getSentencePlanSummary(id, token)
      expect(output).toEqual(summaryPlanResponse)
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

  describe('getSentencePlanComments', () => {
    const planid = '1'
    const sentencePlansCommentsUrl = `/sentenceplans/${planid}/comments`

    it('should return sentence plan comments data', async () => {
      mockedEndpoint.get(sentencePlansCommentsUrl).reply(200, sentencePlanComments)
      const output = await getSentencePlanComments(planid, token)
      expect(output).toEqual(sentencePlanComments)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansCommentsUrl).reply(400)
      await expect(getSentencePlanComments(planid, token)).rejects.toThrowError('Bad Request')
    })
  })

  describe('setSentencePlanComments', () => {
    const planid = '1'
    const sentencePlansCommentsUrl = `/sentenceplans/${planid}/comments`
    const data = [
      {
        comment: 'My diversity comment',
        commentType: 'YOUR_RESPONSIVITY',
      },
    ]

    it('should return sentence plan summary data', async () => {
      mockedEndpoint.put(sentencePlansCommentsUrl).reply(200, {})
      const output = await setSentencePlanComment(planid, data, token)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.put(sentencePlansCommentsUrl).reply(400)
      await expect(setSentencePlanComment(planid, data, token)).rejects.toThrowError('Bad Request')
    })
  })
})
