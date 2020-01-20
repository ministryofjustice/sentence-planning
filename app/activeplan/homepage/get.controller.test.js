const controller = require('./get.controller')
const { getSentencePlanComments } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi')

const commentsEmpty = {}
const commentsPresent = require('../../../mockServer/sentencePlanComments/1.json')

describe('showHomepage', () => {
  const req = {
    params: {
      planId: 12,
      id: 123,
    },
    session: {
      'x-auth-token': '1234',
    },
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    getSentencePlanComments.mockReset()
  })

  it('should pass in the correct values to the render function', async () => {
    getSentencePlanComments.mockReturnValueOnce(commentsPresent)
    req.session.planStarted = false
    const expected = {
      planId: 12,
      id: 123,
      planStarted: false,
      contactArrangements: 'Contact arrangements added for this plan',
      comments: 'Their summary comment',
      decisions: 'My decisions comment',
      diversity: 'My responsivity comment',
      needToKnow: 'Their responsivity comment',
    }
    await controller.getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass in the correct values to the render function when plan has just been started', async () => {
    req.session.planStarted = true
    getSentencePlanComments.mockReturnValueOnce(commentsEmpty)
    const expected = {
      planId: 12,
      id: 123,
      planStarted: true,
      contactArrangements: '',
      comments: '',
      decisions: '',
      diversity: '',
      needToKnow: '',
    }
    await controller.getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if comments are not available', async () => {
    const theError = new Error('Error message')
    getSentencePlanComments.mockImplementation(() => {
      throw theError
    })
    await controller.getHomepage(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
