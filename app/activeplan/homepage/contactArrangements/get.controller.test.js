const { getContactArrangements } = require('./get.controller')
const { getSentencePlanComments } = require('../../../../common/data/sentencePlanningApi')

jest.mock('../../../../common/data/sentencePlanningApi')

const commentsEmpty = {}
const commentsPresent = require('../../../../mockServer/sentencePlanComments/1.json')

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
      headers: {
        'x-auth-token': '1234',
      },
      body: {},
      errors: {},
      errorSummary: {},
      contactArrangements: null,
      renderInfo: {},
    }
    getSentencePlanComments.mockReset()
  })

  it('should set the correct render values when there are no existing comments', async () => {
    const expected = {
      backurl: '/this/is/my#contact',
      errorSummary: {},
      contactArrangements: '',
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsEmpty)
    await getContactArrangements(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when there are existing comments', async () => {
    delete req.body.contactArrangements
    const expected = {
      backurl: '/this/is/my#contact',
      contactArrangements: 'Contact arrangements added for this plan',
      errorSummary: {},
      errors: {},
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await getContactArrangements(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass through any renderInfo or contact information', async () => {
    req.body.contactArrangements = 'A random contact arrangement comment'
    req.renderInfo = {
      testItem1: true,
      textItem: 'hello',
    }
    const expected = {
      backurl: '/this/is/my#contact',
      contactArrangements: 'A random contact arrangement comment',
      errorSummary: {},
      errors: {},
      testItem1: true,
      textItem: 'hello',
    }
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    await getContactArrangements(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if comments are not available', async () => {
    const theError = new Error('Error message')
    getSentencePlanComments.mockImplementation(() => {
      throw theError
    })
    await getContactArrangements(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
