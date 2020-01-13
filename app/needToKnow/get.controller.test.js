const controller = require('./get.controller')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

const commentsEmpty = {}
const commentsPresent = require('../../mockServer/sentencePlanComments/1.json')

describe('getNeedToKnow', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
    },
    session: {
      'x-auth-token': '1234',
    },
    body: {},
    errors: {},
    errorSummary: {},
    needtoknow: null,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    req.renderInfo = {}
    delete req.body.needtoknow
  })

  beforeEach(() => {
    getSentencePlanComments.mockReset()
  })

  it('should set the correct render values when there are no existing comments', async () => {
    const expected = {
      backurl: '/this/is/my/diversity',
      nexturl: '/this/is/my',
      errorSummary: {},
      needtoknow: '',
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsEmpty)
    await controller.getNeedToKnow(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when there are existing comments', async () => {
    delete req.body.needtoknow
    const expected = {
      backurl: '/this/is/my/diversity',
      nexturl: '/this/is/my',
      needtoknow: 'Their responsivity comment',
      errorSummary: {},
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await controller.getNeedToKnow(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass through any renderInfo or needtoknow information', async () => {
    req.body.needtoknow = 'Random needtoknow comment'
    req.renderInfo = {
      testItem1: true,
      textItem: 'hello',
    }
    const expected = {
      backurl: '/this/is/my/diversity',
      nexturl: '/this/is/my',
      needtoknow: 'Random needtoknow comment',
      errorSummary: {},
      errors: {},
      testItem1: true,
      textItem: 'hello',
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await controller.getNeedToKnow(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if comments are not available', async () => {
    const theError = new Error('Error message')
    getSentencePlanComments.mockImplementation(() => {
      throw theError
    })
    await controller.getNeedToKnow(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
