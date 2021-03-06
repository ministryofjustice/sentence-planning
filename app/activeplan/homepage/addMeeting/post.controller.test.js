const { postAddMeeting } = require('./post.controller')
const { addSentencePlanMeeting } = require('../../../../common/data/sentencePlanningApi')
const { getAddMeeting } = require('./get.controller')

jest.mock('../../../../common/data/sentencePlanningApi')
jest.mock('./get.controller')

let req
const tokens = { authorisationToken: 'mytoken' }

beforeEach(() => {
  req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
    },
    tokens,
    body: {
      comments: 'a comment',
      attendees: 'some attendees',
      'meeting-date-Day': '1',
      'meeting-date-Month': '12',
      'meeting-date-year': '2019',
    },
  }
})

afterEach(() => {
  addSentencePlanMeeting.mockReset()
})

const expected = {
  path: '/this/is/my/path',
  params: {
    planId: 1,
  },
  tokens,
  body: {
    comments: 'a comment',
    attendees: 'some attendees',
    'meeting-date-Day': '1',
    'meeting-date-Month': '12',
    'meeting-date-year': '2019',
  },
  errors: {
    errors: [
      {
        location: 'body',
        msg: 'Error message',
        param: 'comments',
        value: '',
      },
    ],
  },
}

describe('postAddMeeting', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  afterEach(() => {
    res.redirect.mockReset()
    res.render.mockReset()
  })

  it('should save the meeting when there are no errors', async () => {
    await postAddMeeting(req, res)
    expect(addSentencePlanMeeting).toHaveBeenCalledWith(
      1,
      { attendees: 'some attendees', comments: 'a comment', dateOfBoard: '2001-12-01T00:00:00.000Z' },
      tokens
    )
    expect(res.redirect).toHaveBeenCalledWith('/this/is/my#meetings')
  })

  it('should redisplay the page when there are errors', async () => {
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'comments',
          location: 'body',
        },
      ],
    }
    await postAddMeeting(req, res)
    expect(addSentencePlanMeeting).not.toHaveBeenCalled()
    expect(getAddMeeting).toHaveBeenCalledWith(expected, res)
  })
  it('should display an error if meeting saving fails', async () => {
    const theError = new Error('Error message')
    addSentencePlanMeeting.mockImplementation(() => {
      throw theError
    })
    await postAddMeeting(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
