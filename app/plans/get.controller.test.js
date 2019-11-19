const controller = require('./get.controller')

const displayText = require('./displayText')

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

  it('should set the correct render values when there is an active plan', async () => {
    req.params.id = 1
    getSentencePlanSummary.mockReturnValueOnce(activePlan)
    const expected = { ...displayText, activePlan: true, individualId: 1 }
    await controller.sentencePlanSummary(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when there is no active plan', async () => {
    req.params.id = 11034
    getSentencePlanSummary.mockReturnValueOnce(noActivePlan)
    const expected = { ...displayText, activePlan: false, individualId: 11034 }
    await controller.sentencePlanSummary(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`', expected)
  })
  it('should return true when a plan has null or no completed date', () => {
    expect(controller.hasActivePlan(activePlan)).toEqual(true)
    expect(controller.hasActivePlan(completedDateAbsent)).toEqual(true)
  })
  it('should return false when all plans are completed', () => {
    expect(controller.hasActivePlan(noActivePlan)).toEqual(false)
    expect(controller.hasActivePlan(emptyObject)).toEqual(false)
  })
})
