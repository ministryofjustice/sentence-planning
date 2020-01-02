const nock = require('nock')
const summaryPlanResponse = require('../../mockServer/sentencePlanSummary/11034.json')
const sentencePlanComments = require('../../mockServer/sentencePlanComments/1.json')
const sentencePlanObjective = require('../../mockServer/sentencePlanObjectives/1.json')
const sentencePlanNeeds = require('../../mockServer/sentencePlanNeeds/1.json')
const sentencePlan = require('../../mockServer/sentencePlans/1.json')

const {
  apis: {
    sentencePlanning: { url },
  },
} = require('../config')
const {
  getSentencePlanSummary,
  getSentencePlan,
  createSentencePlan,
  getSentencePlanComments,
  setSentencePlanComment,
  getSentencePlanObjective,
  addSentencePlanObjective,
  updateSentencePlanObjective,
  getSentencePlanNeeds,
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
    const sentencePlanUrl = `/offenders/${id}/sentenceplans`

    it('should return new sentence plan data', async () => {
      mockedEndpoint.post(sentencePlanUrl).reply(200, summaryPlanResponse)
      const output = await createSentencePlan(id, token)
      expect(output).toEqual(summaryPlanResponse)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlanUrl).reply(400)
      await expect(createSentencePlan(id, token)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlan', () => {
    const planId = 417
    const sentencePlansUrl = `/sentenceplans/${planId}`

    it('should return a sentence plan', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(200, sentencePlan)
      const output = await getSentencePlan(planId, token)
      expect(output).toEqual(sentencePlan)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(400)
      await expect(getSentencePlan(planId, token)).rejects.toThrowError('Bad Request')
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

  describe('getSentencePlanObjective', () => {
    const planid = '1'
    const objectiveid = '1'
    const sentencePlansObjectiveUrl = `/sentenceplans/${planid}/objectives/${objectiveid}`

    it('should return objective data', async () => {
      mockedEndpoint.get(sentencePlansObjectiveUrl).reply(200, sentencePlanObjective)
      const output = await getSentencePlanObjective(planid, objectiveid, token)
      expect(output).toEqual(sentencePlanObjective)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansObjectiveUrl).reply(400)
      await expect(getSentencePlanObjective(planid, objectiveid, token)).rejects.toThrowError('Bad Request')
    })
  })

  describe('setSentencePlanObjective', () => {
    const planid = '1'
    const sentencePlansObjectiveUrl = `/sentenceplans/${planid}/objectives`
    const data = [{ description: 'The objective description', needs: [] }]

    it('should save objective', async () => {
      mockedEndpoint.post(sentencePlansObjectiveUrl).reply(200, {})
      const output = await addSentencePlanObjective(planid, data, token)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlansObjectiveUrl).reply(400)
      await expect(addSentencePlanObjective(planid, data, token)).rejects.toThrowError('Bad Request')
    })
  })

  describe('update SentencePlanObjective', () => {
    const planid = '1'
    const objectiveid = '199'
    const sentencePlansObjectiveUrl = `/sentenceplans/${planid}/objectives/${objectiveid}`
    const data = [{ description: 'The objective description', needs: [] }]

    it('should update objective', async () => {
      mockedEndpoint.put(sentencePlansObjectiveUrl).reply(200, {})
      const output = await updateSentencePlanObjective(planid, objectiveid, data, token)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.put(sentencePlansObjectiveUrl).reply(400)
      await expect(updateSentencePlanObjective(planid, objectiveid, data, token)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlanNeed', () => {
    const planid = '1'
    const sentencePlanNeedsUrl = `/sentenceplans/${planid}/needs`

    it('should return needs data', async () => {
      mockedEndpoint.get(sentencePlanNeedsUrl).reply(200, sentencePlanNeeds)
      const output = await getSentencePlanNeeds(planid, token)
      expect(output).toEqual(sentencePlanNeeds)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlanNeedsUrl).reply(400)
      await expect(getSentencePlanNeeds(planid, token)).rejects.toThrowError('Bad Request')
    })
  })
})
