const { getMeeting } = require('./get.controller')
const { getSentencePlanMeeting } = require('../../../../common/data/sentencePlanningApi')

jest.mock('../../../../common/data/sentencePlanningApi')

const meetingData = require('../../../../mockServer/sentencePlanMeetings/minutes/1.json')

const tokens = { authorisationToken: 'mytoken' }

describe('getDiversity', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      id: 123,
      planId: 456,
      meetingId: 789,
    },
    tokens,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    getSentencePlanMeeting.mockReset()
  })

  it('should set the correct render values when retrieving a meeting', async () => {
    const expected = {
      backurl: '/individual-id/123/plan/456#meetings',
      meeting: meetingData,
    }
    getSentencePlanMeeting.mockReturnValueOnce(meetingData)
    await getMeeting(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if meeting call is bad', async () => {
    const theError = new Error('Error message')
    getSentencePlanMeeting.mockImplementation(() => {
      throw theError
    })
    await getMeeting(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
