const { postContactArrangements } = require('./post.controller')
const { setSentencePlanComment } = require('../../../../common/data/sentencePlanningApi')
const { getContactArrangements } = require('./get.controller')

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
    body: {},
  }
})

afterEach(() => {
  setSentencePlanComment.mockReset()
})

const expected = {
  path: '/this/is/my/path',
  params: {
    planId: 1,
  },
  tokens,
  body: {
    contactArrangements: 'a contact arrangements comment',
  },
  errors: {
    errors: [
      {
        location: 'body',
        msg: 'Error message',
        param: 'contactArrangements',
        value: '',
      },
    ],
  },
}

describe('postContactArrangements', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should save the contact entry when there are no errors', async () => {
    req.body.contactArrangements = 'a contact arrangement comment'
    await postContactArrangements(req, res)
    expect(setSentencePlanComment).toHaveBeenCalledWith(
      1,
      [{ comment: 'a contact arrangement comment', commentType: 'LIAISON_ARRANGEMENTS' }],
      tokens
    )
    expect(res.redirect).toHaveBeenCalledWith('/this/is/my#contact')
  })

  it('should redisplay the page when there are errors', async () => {
    req.body.contactArrangements = 'a contact arrangements comment'
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'contactArrangements',
          location: 'body',
        },
      ],
    }
    await postContactArrangements(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getContactArrangements).toHaveBeenCalledWith(expected, res)
  })
  it('should display an error if comments saving fails', async () => {
    const theError = new Error('Error message')
    setSentencePlanComment.mockImplementation(() => {
      throw theError
    })
    await postContactArrangements(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
