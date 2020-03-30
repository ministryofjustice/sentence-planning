const { sentencePlanSummary, getPlan, getPlanType, getCompletedPlans } = require('./get.controller')

const activePlan = require('../../mockServer/sentencePlanSummary/11033.json')
const noActivePlan = require('../../mockServer/sentencePlanSummary/11034.json')
const draftPlan = require('../../mockServer/sentencePlanSummary/11035.json')
const emptyObject = require('../../mockServer/sentencePlanSummary/11032.json')
const noCompletedPlans = require('../../mockServer/sentencePlanSummary/11036.json')
const incompleteLegacyPlans = require('../../mockServer/sentencePlanSummary/11037.json')
const { getSentencePlanSummary } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi.js', () => ({
  getSentencePlanSummary: jest.fn(),
}))

afterEach(() => {
  getSentencePlanSummary.mockReset()
})

describe('getSentencePlanSummary', () => {
  const req = {
    params: {
      id: 1,
    },
  }
  const res = {
    render: jest.fn(),
  }

  describe('select the current plan', () => {
    test('should select the active plan', () => {
      expect(getPlan(activePlan)).toEqual(activePlan[1])
    })
    test('should select the draft plan', () => {
      expect(getPlan(draftPlan)).toEqual(draftPlan[1])
    })
    test('should select no active or draft plan', () => {
      expect(getPlan(noActivePlan)).toEqual({})
    })
    test('should cope with no input', () => {
      expect(getPlan()).toEqual({})
    })
  })

  describe('compile the completed plans', () => {
    test('should select the completed plans', () => {
      expect(getCompletedPlans(activePlan)).toEqual([activePlan[0], activePlan[2]])
    })

    test('should select no completed plans', () => {
      expect(getCompletedPlans(noCompletedPlans)).toEqual([])
    })
  })

  describe('determine the plan type', () => {
    test('should identify an active plan', () => {
      expect(getPlanType(activePlan[1])).toEqual('active')
    })
    test('should identify a draft plan', () => {
      expect(getPlanType(draftPlan[1])).toEqual('draft')
    })
    test('should identify neither active nor draft', () => {
      expect(getPlanType({})).toEqual('none')
    })
  })

  describe('set up rendering', () => {
    it('should set the correct render values when there is an active plan', async () => {
      req.params.id = 11033
      getSentencePlanSummary.mockReturnValueOnce(activePlan)
      const currentPlan = activePlan[1]
      const completedPlans = [activePlan[0], activePlan[2]]
      const expected = {
        currentPlan,
        individualId: 11033,
        planType: 'active',
        completedPlans,
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is a draft plan', async () => {
      req.params.id = 11035
      getSentencePlanSummary.mockReturnValueOnce(draftPlan)
      const currentPlan = draftPlan[1]
      const completedPlans = [draftPlan[0], draftPlan[2]]
      const expected = {
        currentPlan,
        individualId: 11035,
        planType: 'draft',
        completedPlans,
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is no active or draft plan', async () => {
      req.params.id = 11034
      getSentencePlanSummary.mockReturnValueOnce(noActivePlan)
      const currentPlan = {}
      const completedPlans = noActivePlan
      const expected = {
        currentPlan,
        individualId: 11034,
        planType: 'none',
        completedPlans,
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
        completedPlans: {},
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is a legacy plan with no completed date', async () => {
      req.params.id = 11037
      getSentencePlanSummary.mockReturnValueOnce(incompleteLegacyPlans)
      const expected = {
        individualId: 11037,
        currentPlan: {},
        planType: 'none',
        completedPlans: [
          { planId: '9465346', createdDate: '2020-03-06', completedDate: null, legacy: true, draft: false },
          { planId: '2114597', createdDate: '2012-10-16', completedDate: '2012-06-13', legacy: true, draft: false },
        ],
      }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should display an error if comments are not available', async () => {
      const theError = new Error('Error message')
      getSentencePlanSummary.mockImplementation(() => {
        throw theError
      })
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
