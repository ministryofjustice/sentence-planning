const { getAddMeeting } = require('./get.controller')

describe('getContactArrangements', () => {
  const res = {
    render: jest.fn(),
  }
  let req

  beforeEach(() => {
    req = {
      path: '/this/is/my/path',
      params: {
        planId: 1234,
      },
      body: {},
      errors: {},
      errorSummary: {},
      renderInfo: {},
    }
  })

  it('should set the correct render values when there are no existing meeting details', async () => {
    const expected = {
      backurl: '/this/is/my#meetings',
      errorSummary: {},
      errors: {},
      meetingDateDay: '',
      meetingDateMonth: '',
      meetingDateYear: '',
    }
    await getAddMeeting(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when meeting details are passed in', async () => {
    req.body = {
      comments: 'a comment',
      attendees: 'some attendees',
      'meeting-date-Day': '1',
      'meeting-date-Month': '12',
      'meeting-date-Year': '2018',
    }
    const expected = {
      backurl: '/this/is/my#meetings',
      errorSummary: {},
      errors: {},
      ...req.body,
      meetingDateDay: '1',
      meetingDateMonth: '12',
      meetingDateYear: '2018',
    }
    await getAddMeeting(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
})
