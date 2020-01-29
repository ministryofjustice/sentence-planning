const { getHomepage } = require('./get.controller')
const { getSentencePlan, getSentencePlanMeetings } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi')

const sentencePlanEmpty = {}
const sentencePlan = require('../../../mockServer/sentencePlans/6.json')
const meetings = require('../../../mockServer/sentencePlanMeetings/summary/1.json')

describe('showHomepage', () => {
  const req = {
    params: {
      planId: 12,
      id: 123,
    },
    session: {},
    headers: {
      'x-auth-token': '1234',
    },
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    getSentencePlan.mockReset()
  })

  it('should pass in the correct values to the render function', async () => {
    getSentencePlan.mockReturnValueOnce(sentencePlan)
    getSentencePlanMeetings.mockReturnValueOnce(meetings)
    req.session.planStarted = false
    const expectedObjectives = {
      active: [sentencePlan.objectives[0], sentencePlan.objectives[3]],
      future: [sentencePlan.objectives[1]],
      closed: [sentencePlan.objectives[2]],
    }
    const expected = {
      planId: 12,
      id: 123,
      planStarted: false,
      comments: 'Their summary comment',
      contactArrangements: 'Here are the contact arrangements for this plan',
      decisions: 'My decisions comment',
      diversity: 'My responsivity comment',
      needToKnow: 'Their responsivity comment',
      meetings,
      objectives: expectedObjectives,
    }
    await getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass in the correct values to the render function when plan is empty', async () => {
    req.session.planStarted = true
    getSentencePlan.mockReturnValueOnce(sentencePlanEmpty)
    getSentencePlanMeetings.mockReturnValueOnce([])
    const expected = {
      planId: 12,
      id: 123,
      planStarted: true,
      contactArrangements: '',
      comments: '',
      decisions: '',
      diversity: '',
      needToKnow: '',
      meetings: [],
      objectives: {},
    }
    await getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if comments are not available', async () => {
    const theError = new Error('Error message')
    getSentencePlan.mockImplementation(() => {
      throw theError
    })
    await getHomepage(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
