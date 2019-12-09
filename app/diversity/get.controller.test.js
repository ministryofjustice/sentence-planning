const controller = require('./get.controller')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

const commentsEmpty = {}
const commentsPresent = require('../../mockServer/sentencePlanComments/1.json')

describe('getDiversity', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      planid: 1234,
    },
    session: {
      'x-auth-token': '1234',
    },
    body: {},
    errors: {},
    errorSummary: {},
    diversity: null,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    req.renderInfo = {}
    delete req.body.diversity
  })

  beforeEach(() => {
    getSentencePlanComments.mockReset()
  })

  it('should set the correct render values when there are no existing comments', async () => {
    const expected = {
      backurl: '/this/is/my',
      errorSummary: {},
      diversity: false,
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsEmpty)
    await controller.getDiversity(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when there are existing comments', async () => {
    delete req.body.diversity
    const expected = {
      backurl: '/this/is/my',
      diversity: 'My responsivity comment',
      errorSummary: {},
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await controller.getDiversity(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass through any renderInfo or diversity information', async () => {
    req.body.diversity = 'Random diversity comment'
    req.renderInfo = {
      testItem1: true,
      textItem: 'hello',
    }
    const expected = {
      backurl: '/this/is/my',
      diversity: 'Random diversity comment',
      errorSummary: {},
      errors: {},
      testItem1: true,
      textItem: 'hello',
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await controller.getDiversity(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if comments are not available', async () => {
    const theError = new Error('Error message')
    getSentencePlanComments.mockImplementation(() => {
      throw theError
    })
    await controller.getDiversity(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
