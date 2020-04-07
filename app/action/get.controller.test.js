const { getAction } = require('./get.controller')
const { getSentencePlanObjectiveAction } = require('../../common/data/sentencePlanningApi')
const { getActionDescriptionIntervention } = require('../partials/interventionList/get.controller')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  getSentencePlanObjectiveAction: jest.fn(),
}))
jest.mock('../partials/interventionList/get.controller', () => ({
  getActionDescriptionIntervention: jest.fn(() => ({ intervention: '', description: '' })),
}))
jest.mock('../partials/targetDate/get.controller', () => ({
  getTargetDate: jest.fn(() => ({ targetDateMonth: '', targetDateYear: '' })),
}))
jest.mock('../partials/motivations/get.controller', () => ({
  getMotivation: jest.fn(() => ({ motivationList: [] })),
}))
jest.mock('../partials/responsibility/get.controller', () => ({
  getResponsibility: jest.fn(() => ({ responsibility: ['OTHER'], responsibilityOther: '' })),
}))
jest.mock('../partials/status/get.controller', () => ({
  getStatus: jest.fn(() => ({ status: 'NOT_STARTED' })),
}))

const actionPresent = require('../../mockServer/sentencePlanActions/1.json')

const tokens = { authorisationToken: 'mytoken' }

describe('getAction', () => {
  let req
  beforeEach(() => {
    req = {
      path: '/this/is/my/path',
      params: {
        planId: 1,
        objectiveId: '202',
        actionId: 'NEW',
      },
      tokens,
      body: {},
      errors: {},
      errorSummary: {},
    }
  })
  const res = {
    render: jest.fn(),
  }

  afterEach(() => {
    delete req.body.action
    getSentencePlanObjectiveAction.mockReset()
    getActionDescriptionIntervention.mockReset()
    res.render.mockReset()
  })

  it('should set the correct render values when adding a new action', async () => {
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      intervention: '',
      description: '',
      targetDateMonth: '',
      targetDateYear: '',
      motivationList: [],
      responsibility: ['OTHER'],
      responsibilityOther: '',
      status: 'NOT_STARTED',
    }
    expect(getSentencePlanObjectiveAction).not.toHaveBeenCalled()
    await getAction(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  describe('when editing an action', () => {
    let expected
    beforeEach(() => {
      req.params.actionId = '1'
      expected = {
        backurl: '/this/is',
        nexturl: '/this/is/my',
        errorSummary: {},
        errors: {},
        targetDateMonth: '',
        targetDateYear: '',
        motivationList: [],
        responsibility: ['OTHER'],
        responsibilityOther: '',
        status: 'NOT_STARTED',
      }
      getSentencePlanObjectiveAction.mockReturnValueOnce(actionPresent)
    })
    it('for a draft plan it should set the correct render values', async () => {
      await getAction(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('for an active plan it should set the correct render values', async () => {
      req.path = '/edit-plan/is/my/path'
      expected.backurl = '/edit-plan/is/review'
      expected.nexturl = '/edit-plan/is/my'
      await getAction(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
  it('should process the action description/intervention data', async () => {
    await getAction(req, res)
    expect(getActionDescriptionIntervention).toHaveBeenCalled()
  })
  it('should display an error if unable to retrieve action', async () => {
    req.params.actionId = '1'
    const theError = new Error('Error message')
    getSentencePlanObjectiveAction.mockImplementation(() => {
      throw theError
    })
    await getAction(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
