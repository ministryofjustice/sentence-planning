const controller = require('./post.controller')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getNeedToKnow } = require('./get.controller')

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
    needtoknow: 'a need to know comment',
  },
  errors: {
    errors: [
      {
        location: 'body',
        msg: 'Error message',
        param: 'needtoknow',
        value: '',
      },
    ],
  },
  renderInfo: {
    wordsOver: 0,
  },
}

describe('postNeedToKNow', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should save the need to know entry when there are no errors', async () => {
    req.body.needtoknow = 'a need to know comment'
    await controller.postNeedToKnow(req, res)
    expect(setSentencePlanComment).toHaveBeenCalledWith(
      1,
      [{ comment: 'a need to know comment', commentType: 'THEIR_RESPONSIVITY' }],
      '1234'
    )
    expect(res.redirect).toHaveBeenCalledWith('/this/is/my')
  })

  it('should redisplay the page when there are errors', async () => {
    req.body.needtoknow = 'a need to know comment'
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'needtoknow',
          location: 'body',
        },
      ],
    }
    await controller.postNeedToKnow(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getNeedToKnow).toHaveBeenCalledWith(expected, res)
  })

  it('sets the wordsOver value', async () => {
    req.body.needtoknow = Array(255).join('word ')
    req.tooManyWords = true
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'needtoknow',
          location: 'body',
        },
      ],
    }
    expected.body.needtoknow = Array(255).join('word ')
    expected.tooManyWords = true
    expected.renderInfo.wordsOver = 4
    await controller.postNeedToKnow(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getNeedToKnow).toHaveBeenCalledWith(expected, res)
  })
  it('should display an error if comments saving fails', async () => {
    const theError = new Error('Error message')
    setSentencePlanComment.mockImplementation(() => {
      throw theError
    })
    await controller.postNeedToKnow(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
