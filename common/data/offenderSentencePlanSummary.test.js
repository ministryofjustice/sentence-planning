const nock = require('nock')
const response = require('../../mockServer/sentencePlanSummary/11034.json')

const {
  apis: {
    sentencePlanning: { url },
  },
} = require('../config')
const { getSentencePlanSummary } = require('./offenderSentencePlanSummary')

describe('offenderSentencePlanSummary', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  let mockedEndpoint
  const token = '1234'
  const id = '123458'
  const offenderAssessmentUrl = `/offenders/${id}/sentenceplans`

  describe('getSentencePlanSummary', () => {
    let fakeSentencePlanningAPI

    beforeEach(() => {
      mockedEndpoint = nock(url)
    })
    it('should return sentence plan summary data', async () => {
      mockedEndpoint.get(offenderAssessmentUrl).reply(200, response)
      const output = await getSentencePlanSummary(id, token)
      expect(output).toEqual(response)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(offenderAssessmentUrl).reply(400)
      await expect(getSentencePlanSummary(id, token)).rejects.toThrowError('Bad Request')
    })
  })
})
