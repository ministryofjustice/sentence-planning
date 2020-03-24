const { printFullSentencePlan } = require('./get.controller')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const { expectedObjectives } = require('./testSupportFiles/expectedObjectives')
const { getInterventions } = require('../../../common/data/sentencePlanningApi')

const sentencePlan = require('../../../mockServer/sentencePlans/6.json')

jest.mock('../../../common/data/sentencePlanningApi', () => ({
  getInterventions: jest.fn(),
  getSentencePlan: jest.fn(),
}))

const tokens = { authorisationToken: 'mytoken' }
const sentencePlanEmpty = {}

const interventions = [
  {
    longDescription: 'Long description for Intervention 1',
    shortDescription: 'Intervention 1',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
  },
  {
    longDescription: 'Long description for Intervention 2',
    shortDescription: 'Intervention 2',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa2',
  },
  {
    longDescription: 'Long description for Intervention 3',
    shortDescription: 'Intervention 3',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa3',
  },
]

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
    getInterventions.mockReturnValueOnce(interventions)
  })
  afterEach(() => {
    getSentencePlan.mockReset()
    getInterventions.mockReset()
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
