const nock = require('nock')
const summaryPlanResponse = require('../../mockServer/sentencePlanSummary/11034.json')
const sentencePlanComments = require('../../mockServer/sentencePlanComments/1.json')
const sentencePlanObjective = require('../../mockServer/sentencePlanObjectives/1.json')
const sentencePlanNeeds = require('../../mockServer/sentencePlanNeeds/1.json')
const sentencePlanAction = require('../../mockServer/sentencePlanActions/1.json')
const sentencePlan = require('../../mockServer/sentencePlans/1.json')
const sentencePlanMeetings = require('../../mockServer/sentencePlanMeetings/summary/1.json')
const sentencePlanMeeting = require('../../mockServer/sentencePlanMeetings/minutes/1.json')

jest.mock('../utils/util', () => ({
  getCorrelationId: jest.fn(() => 'mocked-correlation-id'),
}))

const {
  apis: {
    sentencePlanning: { url },
  },
} = require('../config')
const {
  getOffenderData,
  getSentencePlanSummary,
  getSentencePlan,
  getOasysSentencePlan,
  createSentencePlan,
  getSentencePlanComments,
  setSentencePlanComment,
  getSentencePlanObjective,
  addSentencePlanObjective,
  updateSentencePlanObjective,
  getSentencePlanNeeds,
  addSentencePlanObjectiveAction,
  getSentencePlanObjectiveAction,
  updateSentencePlanObjectiveAction,
  addSentencePlanObjectiveActionProgress,
  getInterventions,
  getMotivations,
  getSentencePlanMeetings,
  getSentencePlanMeeting,
  addSentencePlanMeeting,
  startSentencePlan,
  endSentencePlan,
  updateSentencePlanObjectiveClose,
  setActionPriorities,
} = require('./sentencePlanningApi')

describe('sentencePlanningApi', () => {
  beforeEach(() => {
    mockedEndpoint = nock(url)
  })
  afterEach(() => {
    nock.cleanAll()
  })
  let mockedEndpoint
  const tokens = { authorisationToken: 'mytoken' }
  const id = '123458'

  describe('getOffenderData', () => {
    const offenderAssessmentUrl = `/offenders/oasysOffenderId/${id}`
    it('should return offender details from api', async () => {
      const offenderData = {
        oasysOffenderId: 11032,
        familyName: 'Shakey',
        forename1: 'Bernard',
        crn: 'S000001',
        nomisId: 'A0000AB',
      }
      mockedEndpoint.get(offenderAssessmentUrl).reply(200, offenderData)
      const output = await getOffenderData(id, tokens)
      expect(output).toEqual(offenderData)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(offenderAssessmentUrl).reply(400)
      await expect(getOffenderData(id, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlanSummary', () => {
    const sentencePlansUrl = `/offenders/${id}/sentenceplans`

    it('should return sentence plan summary data', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(200, summaryPlanResponse)
      const output = await getSentencePlanSummary(id, tokens)
      expect(output).toEqual(summaryPlanResponse)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(400)
      await expect(getSentencePlanSummary(id, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('createSentencePlan', () => {
    const sentencePlanUrl = `/offenders/${id}/sentenceplans`

    it('should return new sentence plan data', async () => {
      mockedEndpoint.post(sentencePlanUrl).reply(200, summaryPlanResponse)
      const output = await createSentencePlan(id, tokens)
      expect(output).toEqual(summaryPlanResponse)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlanUrl).reply(400)
      await expect(createSentencePlan(id, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlan', () => {
    const planId = 417
    const sentencePlansUrl = `/sentenceplans/${planId}`

    it('should return a sentence plan', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(200, sentencePlan)
      const output = await getSentencePlan(planId, tokens)
      expect(output).toEqual(sentencePlan)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansUrl).reply(400)
      await expect(getSentencePlan(planId, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getOasysSentencePlan', () => {
    const planId = 417
    const individualId = 417
    const oasysSentencePlansUrl = `/offenders/${individualId}/sentenceplans/${planId}`

    it('should return a sentence plan', async () => {
      mockedEndpoint.get(oasysSentencePlansUrl).reply(200, sentencePlan)
      const output = await getOasysSentencePlan(individualId, planId, tokens)
      expect(output).toEqual(sentencePlan)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(oasysSentencePlansUrl).reply(400)
      await expect(getOasysSentencePlan(individualId, planId, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlanComments', () => {
    const planid = '1'
    const sentencePlansCommentsUrl = `/sentenceplans/${planid}/comments`

    it('should return sentence plan comments data', async () => {
      mockedEndpoint.get(sentencePlansCommentsUrl).reply(200, sentencePlanComments)
      const output = await getSentencePlanComments(planid, tokens)
      expect(output).toEqual(sentencePlanComments)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansCommentsUrl).reply(400)
      await expect(getSentencePlanComments(planid, tokens)).rejects.toThrowError('Bad Request')
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
      const output = await setSentencePlanComment(planid, data, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.put(sentencePlansCommentsUrl).reply(400)
      await expect(setSentencePlanComment(planid, data, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlanObjective', () => {
    const planid = '1'
    const objectiveid = '1'
    const sentencePlansObjectiveUrl = `/sentenceplans/${planid}/objectives/${objectiveid}`

    it('should return objective data', async () => {
      mockedEndpoint.get(sentencePlansObjectiveUrl).reply(200, sentencePlanObjective)
      const output = await getSentencePlanObjective(planid, objectiveid, tokens)
      expect(output).toEqual(sentencePlanObjective)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlansObjectiveUrl).reply(400)
      await expect(getSentencePlanObjective(planid, objectiveid, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('setSentencePlanObjective', () => {
    const planid = '1'
    const sentencePlansObjectiveUrl = `/sentenceplans/${planid}/objectives`
    const data = [{ description: 'The objective description', needs: [] }]

    it('should save objective', async () => {
      mockedEndpoint.post(sentencePlansObjectiveUrl).reply(200, {})
      const output = await addSentencePlanObjective(planid, data, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlansObjectiveUrl).reply(400)
      await expect(addSentencePlanObjective(planid, data, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('update SentencePlanObjective', () => {
    const planid = '1'
    const objectiveid = '199'
    const sentencePlansObjectiveUrl = `/sentenceplans/${planid}/objectives/${objectiveid}`
    const data = [{ description: 'The objective description', needs: [] }]

    it('should update objective', async () => {
      mockedEndpoint.put(sentencePlansObjectiveUrl).reply(200, {})
      const output = await updateSentencePlanObjective(planid, objectiveid, data, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.put(sentencePlansObjectiveUrl).reply(400)
      await expect(updateSentencePlanObjective(planid, objectiveid, data, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getSentencePlanNeed', () => {
    const planid = '1'
    const sentencePlanNeedsUrl = `/sentenceplans/${planid}/needs`

    it('should return needs data', async () => {
      mockedEndpoint.get(sentencePlanNeedsUrl).reply(200, sentencePlanNeeds)
      const output = await getSentencePlanNeeds(planid, tokens)
      expect(output).toEqual(sentencePlanNeeds)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(sentencePlanNeedsUrl).reply(400)
      await expect(getSentencePlanNeeds(planid, tokens)).rejects.toThrowError('Bad Request')
    })
  })
  describe('concerning actions', () => {
    const sentencePlanId = 417
    const objectiveId = 503
    const sentencePlansUrl = `/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions`
    const data = { description: 'The action description', id: 101 }

    describe('addSentencePlanObjectiveAction', () => {
      it('should return a 200 status code', async () => {
        mockedEndpoint.post(sentencePlansUrl).reply(200, {})
        const output = await addSentencePlanObjectiveAction(sentencePlanId, objectiveId, data, tokens)
        expect(output).toEqual({})
      })
      it('should throw an error if it does not receive a valid response', async () => {
        mockedEndpoint.post(sentencePlansUrl).reply(400)
        await expect(addSentencePlanObjectiveAction(sentencePlanId, objectiveId, data, tokens)).rejects.toThrowError(
          'Bad Request'
        )
      })
    })

    describe('for a pre-existing action', () => {
      const actionId = 101
      const actionIdUrl = `${sentencePlansUrl}/${actionId}`

      describe('updateSentencePlanObjectiveAction', () => {
        it('should return an action', async () => {
          mockedEndpoint.put(actionIdUrl, data).reply(200, sentencePlanAction)
          const output = await updateSentencePlanObjectiveAction(sentencePlanId, objectiveId, actionId, data, tokens)
          expect(output).toEqual(sentencePlanAction)
        })
        it('should throw an error if it does not receive a valid response', async () => {
          mockedEndpoint.put(actionIdUrl, data).reply(400)
          await expect(
            updateSentencePlanObjectiveAction(sentencePlanId, objectiveId, actionId, data, tokens)
          ).rejects.toThrowError('Bad Request')
        })
      })

      describe('getSentencePlanObjectiveAction', () => {
        it('should return an action', async () => {
          mockedEndpoint.get(actionIdUrl).reply(200, sentencePlanAction)
          const output = await getSentencePlanObjectiveAction(sentencePlanId, objectiveId, actionId, tokens)
          expect(output).toEqual(sentencePlanAction)
        })
        it('should throw an error if it does not receive a valid response', async () => {
          mockedEndpoint.get(actionIdUrl).reply(400)
          await expect(
            getSentencePlanObjectiveAction(sentencePlanId, objectiveId, actionId, tokens)
          ).rejects.toThrowError('Bad Request')
        })
      })

      describe('addSentencePlanObjectiveActionProgress', () => {
        const progressUrl = `${actionIdUrl}/progress`
        const progressSuccess = {
          body: {},
          statusCode: '100 CONTINUE',
          statusCodeValue: 0,
        }
        it('should return an action', async () => {
          mockedEndpoint.post(progressUrl, data).reply(200, progressSuccess)
          const output = await addSentencePlanObjectiveActionProgress(
            sentencePlanId,
            objectiveId,
            actionId,
            data,
            tokens
          )
          expect(output).toEqual(progressSuccess)
        })
        it('should throw an error if it does not receive a valid response', async () => {
          mockedEndpoint.post(progressUrl, data).reply(400)
          await expect(
            addSentencePlanObjectiveActionProgress(sentencePlanId, objectiveId, actionId, data, tokens)
          ).rejects.toThrowError('Bad Request')
        })
      })
    })
  })

  describe('getInterventions', () => {
    const interventionsUrl = '/interventions'

    it('should return an intervention list', async () => {
      const interventions = [
        {
          longDescription: 'string',
          shortDescription: 'string',
          uuid: 'string',
        },
      ]
      mockedEndpoint.get(interventionsUrl).reply(200, interventions)
      const output = await getInterventions(tokens)
      expect(output).toEqual(interventions)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(interventionsUrl).reply(400)
      await expect(getInterventions(tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getMotivations', () => {
    const motivationUrl = '/motivation'

    it('should return an motivations list', async () => {
      const motivations = [
        {
          motivationText: 'string',
          uuid: 'string',
        },
      ]
      mockedEndpoint.get(motivationUrl).reply(200, motivations)
      const output = await getMotivations(tokens)
      expect(output).toEqual(motivations)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(motivationUrl).reply(400)
      await expect(getMotivations(tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('getMeetings', () => {
    describe('getSentencePlanMeetings', () => {
      const sentencePlanReviewsUrl = `/offenders/${id}/reviews`

      it('should return sentence plan meetings data', async () => {
        mockedEndpoint.get(sentencePlanReviewsUrl).reply(200, sentencePlanMeetings)
        const output = await getSentencePlanMeetings(id, tokens)
        expect(output).toEqual(sentencePlanMeetings)
      })
      it('should throw an error if it does not receive a valid response', async () => {
        mockedEndpoint.get(sentencePlanReviewsUrl).reply(400)
        await expect(getSentencePlanMeetings(id, tokens)).rejects.toThrowError('Bad Request')
      })
    })
  })

  describe('getMeeting', () => {
    const meetingId = 1
    describe('getSentencePlanMeeting', () => {
      const sentencePlanReviewUrl = `/offenders/${id}/reviews/${meetingId}`

      it('should return sentence plan meetings data', async () => {
        mockedEndpoint.get(sentencePlanReviewUrl).reply(200, sentencePlanMeeting)
        const output = await getSentencePlanMeeting(id, meetingId, tokens)
        expect(output).toEqual(sentencePlanMeeting)
      })
      it('should throw an error if it does not receive a valid response', async () => {
        mockedEndpoint.get(sentencePlanReviewUrl).reply(400)
        await expect(getSentencePlanMeeting(id, meetingId, tokens)).rejects.toThrowError('Bad Request')
      })
    })
  })

  describe('addSentencePlanMeeting', () => {
    const planid = '1'
    const sentencePlansAddMeetingUrl = `/sentenceplans/${planid}/reviews`
    const data = {
      comments: 'Description of the meeting',
      attendees: 'these are the attendees',
      dateOfBoard: '2020-02-03T00:00:00.000Z',
    }

    it('should save meeting', async () => {
      mockedEndpoint.post(sentencePlansAddMeetingUrl).reply(200, {})
      const output = await addSentencePlanMeeting(planid, data, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlansAddMeetingUrl).reply(400)
      await expect(addSentencePlanMeeting(planid, data, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('startSentencePlan', () => {
    const planid = '123'
    const startSentencePlanUrl = `/sentenceplans/${planid}/start`

    it('should return with empty body', async () => {
      mockedEndpoint.post(startSentencePlanUrl).reply(200)
      const output = await startSentencePlan(planid, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(startSentencePlanUrl).reply(400)
      await expect(startSentencePlan(planid, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('endSentencePlan', () => {
    const planid = '123'
    const endSentencePlanUrl = `/sentenceplans/${planid}/end`

    it('should return with empty body', async () => {
      mockedEndpoint.post(endSentencePlanUrl).reply(200)
      const output = await endSentencePlan(planid, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(endSentencePlanUrl).reply(400)
      await expect(endSentencePlan(planid, tokens)).rejects.toThrowError('Bad Request')
    })
  })

  describe('closeSentencePlanObjective', () => {
    const planId = '1'
    const objectiveId = '2'
    const sentencePlansObjectiveCloseUrl = `/sentenceplans/${planId}/objectives/${objectiveId}/close`
    const data = [{ comment: 'Objective closure reason' }]

    it('should close objective', async () => {
      mockedEndpoint.post(sentencePlansObjectiveCloseUrl).reply(200, {})
      const output = await updateSentencePlanObjectiveClose(planId, objectiveId, data, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(sentencePlansObjectiveCloseUrl).reply(400)
      await expect(updateSentencePlanObjectiveClose(planId, objectiveId, data, tokens)).rejects.toThrowError(
        'Bad Request'
      )
    })
  })

  describe('setActionPriorities', () => {
    const planId = '1'
    const objectiveId = '2'
    const setActionPrioritiesUrl = `/sentenceplans/${planId}/objectives/${objectiveId}/actions/priority`
    const data = [
      {
        actionUUID: '11111111-1111-1111-1111-111111111111',
        priority: 1,
      },
      {
        actionUUID: '22222222-2222-2222-2222-222222222222',
        priority: 2,
      },
    ]

    it('should set the action priorities', async () => {
      mockedEndpoint.post(setActionPrioritiesUrl).reply(200, {})
      const output = await setActionPriorities(planId, objectiveId, data, tokens)
      expect(output).toEqual({})
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.post(setActionPrioritiesUrl).reply(400)
      await expect(setActionPriorities(planId, objectiveId, data, tokens)).rejects.toThrowError('Bad Request')
    })
  })
})
