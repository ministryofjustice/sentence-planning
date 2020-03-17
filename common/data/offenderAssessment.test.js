const nock = require('nock')
const {
  apis: {
    offenderAssessment: { url },
  },
} = require('../config')
const { getOffenderData } = require('./offenderAssessment')

jest.mock('./nomisOAuth', () => () => 'token-1')

describe('offenderAssessment', () => {
  let fakeOffenderAssessmentAPI

  const token = 'token-1'
  const id = '123458'
  const offenderAssessmentUrl = `/offenders/oasysOffenderId/${id}`

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getOffenderData', () => {
    const response = {
      oasysOffenderId: 11032,
      familyName: 'Shakey',
      forename1: 'Bernard',
      crn: 'S000001',
      nomisId: 'A0000AB',
    }
    beforeEach(() => {
      fakeOffenderAssessmentAPI = nock(url).matchHeader('authorization', `Bearer ${token}`)
    })
    it('should return token from api', async () => {
      fakeOffenderAssessmentAPI.get(offenderAssessmentUrl).reply(200, response)
      const output = await getOffenderData(id)
      expect(output).toEqual(response)
    })
    it('should throw an error if it does not recieve a valid response', async () => {
      fakeOffenderAssessmentAPI.get(offenderAssessmentUrl).reply(403)
      expect(getOffenderData(id)).rejects.toThrowError(403)
    })
  })
})
