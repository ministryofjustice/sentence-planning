const controller = require('./post.controller')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getDecisions } = require('./get.controller')

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('./get.controller')

let req
let expected

beforeEach(() => {
  req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
    },
    headers: {
      'x-auth-token': '1234',
    },
    body: {},
    renderInfo: null,
  }
  setSentencePlanComment.mockReset()
  expected = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
    },
    headers: {
      'x-auth-token': '1234',
    },
    body: {
      decisions: 'a decisions comment',
    },
    errors: {
      errors: [
        {
          location: 'body',
          msg: 'Error message',
          param: 'decisions',
          value: '',
        },
      ],
    },
    renderInfo: {
      wordsOver: 0,
    },
  }
})

describe('postDecisions', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should save the decisions entry when there are no errors', async () => {
    req.body.decisions = 'a decisions comment'
    await controller.postDecisions(req, res)
    expect(setSentencePlanComment).toHaveBeenCalledWith(
      1,
      [{ comment: 'a decisions comment', commentType: 'YOUR_SUMMARY' }],
      '1234'
    )
    expect(res.redirect).toHaveBeenCalledWith('./comments')
  })

  it('should redisplay the page when there are errors', async () => {
    req.body.decisions = 'a decisions comment'
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'decisions',
          location: 'body',
        },
      ],
    }
    await controller.postDecisions(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getDecisions).toHaveBeenCalledWith(expected, res)
  })

  it('sets the wordsOver value', async () => {
    req.body.decisions = Array(255).join('word ')
    req.tooManyWords = true
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'decisions',
          location: 'body',
        },
      ],
    }
    expected.body.decisions = Array(255).join('word ')
    expected.tooManyWords = true
    expected.renderInfo.wordsOver = 4
    await controller.postDecisions(req, res)
    expect(setSentencePlanComment).not.toHaveBeenCalled()
    expect(getDecisions).toHaveBeenCalledWith(expected, res)
  })
  it('should display an error if comments saving fails', async () => {
    const theError = new Error('Error message')
    setSentencePlanComment.mockImplementation(() => {
      throw theError
    })
    await controller.postDecisions(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
