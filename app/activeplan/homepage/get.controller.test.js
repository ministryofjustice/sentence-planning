const controller = require('./get.controller')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi')

const sentencePlanEmpty = {}
const sentencePlan = require('../../../mockServer/sentencePlans/6.json')

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
    getSentencePlan.mockReset()
  })

  it('should pass in the correct values to the render function', async () => {
    getSentencePlan.mockReturnValueOnce(sentencePlan)
    req.session.planStarted = false
    const expected = {
      planId: 12,
      id: 123,
      planStarted: false,
      contactArrangements: 'Contact arrangements added for this plan',
      comments: 'carrots carrots carrots',
      decisions: 'peas peas peas',
      diversity: 'bacon bacon bacon',
      needToKnow: 'egg egg egg',
    }
    await controller.getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass in the correct values to the render function when plan is empty', async () => {
    req.session.planStarted = true
    getSentencePlan.mockReturnValueOnce(sentencePlanEmpty)
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
    getSentencePlan.mockImplementation(() => {
      throw theError
    })
    await controller.getHomepage(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
