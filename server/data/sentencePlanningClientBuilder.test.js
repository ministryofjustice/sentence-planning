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
})
