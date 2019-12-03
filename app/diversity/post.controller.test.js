const controller = require('./post.controller')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getDiversity } = require('./get.controller')

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
    diversity: 'a diversity comment',
  },
  errors: {
    errors: [
      {
        location: 'body',
        msg: 'Error message',
        param: 'diversity',
        value: '',
      },
    ],
  },
  renderInfo: {
    wordsOver: 0,
  },
}

describe('postDiversity', () => {
  const res = {
    redirect: jest.fn(),
  }

  it('should save the diversity entry when there are no errors', async () => {
    req.body.diversity = 'a diversity comment'
    await controller.postDiversity(req, res)
    expect(setSentencePlanComment).toHaveBeenCalledWith(
      1,
      [{ comment: 'a diversity comment', commentType: 'YOUR_RESPONSIVITY' }],
      '1234'
    )
    expect(res.redirect).toHaveBeenCalledWith('./need-to-know')
  })

  it('should redisplay the page when there are errors', async () => {
    req.body.diversity = 'a diversity comment'
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'diversity',
          location: 'body',
        },
      ],
    }
    await controller.postDiversity(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getDiversity).toHaveBeenCalledWith(expected, res)
  })

  it('sets the wordsOver value', async () => {
    req.body.diversity = Array(255).join('word ')
    req.tooManyWords = true
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'diversity',
          location: 'body',
        },
      ],
    }
    expected.body.diversity = Array(255).join('word ')
    expected.tooManyWords = true
    expected.renderInfo.wordsOver = 4
    await controller.postDiversity(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getDiversity).toHaveBeenCalledWith(expected, res)
  })
})
