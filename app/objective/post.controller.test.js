const controller = require('./post.controller')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getComments } = require('./get.controller')

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('./get.controller')

let req

beforeEach(() => {
  req = {
    path: '/this/is/my/path',
    params: {
      planid: 1,
    },
    session: {
      'x-auth-token': '1234',
    },
    body: {},
    renderInfo: null,
  }
  setSentencePlanComment.mockReset()
})

const expected = {
  path: '/this/is/my/path',
  params: {
    planid: 1,
  },
  session: {
    'x-auth-token': '1234',
  },
  body: {
    comments: 'an individual’s comment',
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
  renderInfo: {
    wordsOver: 0,
  },
}

describe('postComments', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should save the comment entry when there are no errors', async () => {
    req.body.comments = 'an individual’s comment'
    await controller.postComments(req, res)
    expect(setSentencePlanComment).toHaveBeenCalledWith(
      1,
      [{ comment: 'an individual’s comment', commentType: 'THEIR_SUMMARY' }],
      '1234'
    )
    expect(res.redirect).toHaveBeenCalledWith('/this/is/my')
  })

  it('should redisplay the page when there are errors', async () => {
    req.body.comments = 'an individual’s comment'
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
    await controller.postComments(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getComments).toHaveBeenCalledWith(expected, res)
  })

  it('sets the wordsOver value', async () => {
    req.body.comments = Array(255).join('word ')
    req.tooManyWords = true
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
    expected.body.comments = Array(255).join('word ')
    expected.tooManyWords = true
    expected.renderInfo.wordsOver = 4
    await controller.postComments(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getComments).toHaveBeenCalledWith(expected, res)
  })
  it('should display an error if comments saving fails', async () => {
    const theError = new Error('Error message')
    setSentencePlanComment.mockImplementation(() => {
      throw theError
    })
    await controller.postComments(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
