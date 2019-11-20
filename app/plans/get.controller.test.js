const { sentencePlanSummary, hasActivePlan } = require('./get.controller')

const activePlan = require('../../mockServer/sentencePlanSummary/11033.json')
const noActivePlan = require('../../mockServer/sentencePlanSummary/11034.json')
const completedDateAbsent = require('../../mockServer/sentencePlanSummary/11035.json')
const emptyObject = require('../../mockServer/sentencePlanSummary/11032.json')
const { getSentencePlanSummary } = require('../../common/data/offenderSentencePlanSummary')

jest.mock('../../common/data/offenderSentencePlanSummary.js', () => ({
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
      req.params.id = 1
      getSentencePlanSummary.mockReturnValueOnce(activePlan)
      const expected = { activePlan: true, individualId: 1 }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should set the correct render values when there is no active plan', async () => {
      req.params.id = 11034
      getSentencePlanSummary.mockReturnValueOnce(noActivePlan)
      const expected = { activePlan: false, individualId: 11034 }
      await sentencePlanSummary(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
  describe('check if active plan is present', () => {
    it('should return true when a plan has null or no completed date', () => {
      expect(hasActivePlan(activePlan)).toEqual(true)
      expect(hasActivePlan(completedDateAbsent)).toEqual(true)
    })
    it('should return false when all plans are completed', () => {
      expect(hasActivePlan(noActivePlan)).toEqual(false)
      expect(hasActivePlan(emptyObject)).toEqual(false)
    })
  })
})
