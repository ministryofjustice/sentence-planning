const controller = require('./get.controller')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

const commentsEmpty = {}
const commentsPresent = require('../../mockServer/sentencePlanComments/1.json')

const tokens = { authorisationToken: 'mytoken' }

describe('getDecision', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      planId: 1234,
    },
    tokens,
    body: {},
    errors: {},
    errorSummary: {},
    decisions: null,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    req.renderInfo = {}
    delete req.body.decisions
    getSentencePlanComments.mockReset()
  })

  it('should set the correct render values when there are no existing comments', async () => {
    const expected = {
      backurl: '/this/is/my',
      errorSummary: {},
      decisions: '',
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsEmpty)
    await controller.getDecisions(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when there are existing comments', async () => {
    const expected = {
      backurl: '/this/is/my',
      decisions: 'My decisions comment',
      errorSummary: {},
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await controller.getDecisions(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass through any renderInfo or decisions information', async () => {
    req.body.decisions = 'A random decisions comment'
    req.renderInfo = {
      testItem1: true,
      textItem: 'hello',
    }
    const expected = {
      backurl: '/this/is/my',
      decisions: 'A random decisions comment',
      errorSummary: {},
      errors: {},
      testItem1: true,
      textItem: 'hello',
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await controller.getDecisions(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if comments are not available', async () => {
    const theError = new Error('Error message')
    getSentencePlanComments.mockImplementation(() => {
      throw theError
    })
    await controller.getDecisions(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
