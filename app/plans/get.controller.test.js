const { sentencePlanSummary } = require('./get.controller')

const activePlan = require('../../mockServer/sentencePlanSummary/11033.json')
const noActivePlan = require('../../mockServer/sentencePlanSummary/11034.json')
const draftPlan = require('../../mockServer/sentencePlanSummary/11035.json')
const emptyObject = require('../../mockServer/sentencePlanSummary/11032.json')
const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi.js', () => ({
  getSentencePlanSummary: jest.fn(),
}))

describe('getSentencePlanSummary', () => {
  const req = {
    params: {
      id: 1,
    },
    session: {
      'x-auth-token': '1234',
    },
  }
  const res = {
    render: jest.fn(),
  }

  describe('set up rendering', () => {
    it('should set the correct render values when there is an active plan', async () => {
      req.params.id = 11033
      getSentencePlanSummary.mockReturnValueOnce(activePlan)
      const expected = {
        currentPlan: {
          completedDate: '',
          createdDate: '2019-02-27',
          isDraft: false,
          legacy: false,
          planId: '2345',
        },
        individualId: 11033,
        planType: 'active',
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is a draft plan', async () => {
      req.params.id = 11035
      getSentencePlanSummary.mockReturnValueOnce(draftPlan)
      const expected = {
        currentPlan: {
          createdDate: '2019-02-27',
          isDraft: true,
          legacy: false,
          planId: '2345',
        },
        individualId: 11035,
        planType: 'draft',
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is no active or draft plan', async () => {
      req.params.id = 11034
      getSentencePlanSummary.mockReturnValueOnce(noActivePlan)
      const expected = {
        currentPlan: {},
        individualId: 11034,
        planType: 'none',
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is no plan information', async () => {
      req.params.id = 11032
      getSentencePlanSummary.mockReturnValueOnce(emptyObject)
      const expected = {
        currentPlan: {},
        individualId: 11032,
        planType: 'none',
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
