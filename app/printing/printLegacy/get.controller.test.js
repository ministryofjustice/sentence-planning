const { printFullSentencePlan } = require('./get.controller')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const { expectedObjectives } = require('./testSupportFiles/expectedObjectives')

const sentencePlan = require('../../../mockServer/sentencePlans/6.json')

jest.mock('../../../common/data/sentencePlanningApi')

const tokens = { authorisationToken: 'mytoken' }
const sentencePlanEmpty = {}

describe('printFullSentencePlan', () => {
  const req = {
    path: 'lead/me/up/the/garden/path',
    params: {
      id: 1,
      planId: 6,
    },
    tokens,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    getSentencePlan.mockReset()
  })

  describe('show print page', () => {
    it('should set the correct render values when getting a full sentence plan', async () => {
      const expected = {
        backUrl: 'lead/me/up/the/garden',
        comments: 'Their summary comment',
        decisions: 'My decisions comment',
        diversity: 'My responsivity comment',
        needToKnow: 'Their responsivity comment',
        objectives: expectedObjectives,
      }
      getSentencePlan.mockReturnValueOnce(sentencePlan)
      await printFullSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should pass in the correct values to the render function when plan is empty', async () => {
      getSentencePlan.mockReturnValueOnce(sentencePlanEmpty)
      const expected = {
        backUrl: 'lead/me/up/the/garden',
        comments: '',
        decisions: '',
        diversity: '',
        needToKnow: '',
        objectives: {},
      }
      await printFullSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })

    it('should display an error if plan is not available', async () => {
      const theError = new Error('Error message')
      getSentencePlan.mockImplementation(() => {
        throw theError
      })
      await printFullSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
