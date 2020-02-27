const { printSimplifiedSentencePlan } = require('./get.controller')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const { expectedObjectives } = require('./testSupportFiles/expectedObjectives')

jest.mock('../../../common/data/sentencePlanningApi')

const tokens = { authorisationToken: 'mytoken' }
const sentencePlanEmpty = {}
const sentencePlan = require('../../../mockServer/sentencePlans/6.json')

describe('printSimplifiedSentencePlan', () => {
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
        objectives: expectedObjectives,
      }
      getSentencePlan.mockReturnValueOnce(sentencePlan)
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should pass in the correct values to the render function when plan is empty', async () => {
      getSentencePlan.mockReturnValueOnce(sentencePlanEmpty)
      const expected = {
        backUrl: 'lead/me/up/the/garden',
        objectives: {},
      }
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })

    it('should display an error if plan is not available', async () => {
      const theError = new Error('Error message')
      getSentencePlan.mockImplementation(() => {
        throw theError
      })
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
