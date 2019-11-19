const nock = require('nock')
const controller = require('./get.controller')

const displayText = require('./displayText')

const activePlan = require('../../mockServer/sentencePlanSummary/11033.json')
const noActivePlan = require('../../mockServer/sentencePlanSummary/11034.json')
const completedDateAbsent = require('../../mockServer/sentencePlanSummary/11035.json')
const emptyObject = require('../../mockServer/sentencePlanSummary/11032.json')

const summaryApi = jest.mock('../../common/data/offenderSentencePlanSummary.js')

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

  beforeEach(() => {
    nock('http://localhost:18081')
      .get('/offenders/1/sentenceplans')
      .reply(200, activePlan)
    nock('http://localhost:18081')
      .get('/offenders/11034/sentenceplans')
      .reply(200, noActivePlan)
  })
  afterEach(() => {
    nock.cleanAll()
  })

  it('should set the correct render values when there is an active plan', async () => {
    const expected = {
      activePlan: true,
      heading: 'Active plan',
      individualId: 1,
      no_plan: 'There is no active plan',
      start_plan: 'Start a new plan',
    }
    const result = await controller.sentencePlanSummary(req, res)
    expect(res.render).toHaveBeenCalledWith('app/plans/index', expected)
  })
  it('should set the correct render values when there is no active plan', async () => {
    req.params.id = 11034
    const expected = {
      activePlan: false,
      heading: 'Active plan',
      individualId: 11034,
      no_plan: 'There is no active plan',
      start_plan: 'Start a new plan',
    }
    const result = await controller.sentencePlanSummary(req, res)
    expect(res.render).toHaveBeenCalledWith('app/plans/index', expected)
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
