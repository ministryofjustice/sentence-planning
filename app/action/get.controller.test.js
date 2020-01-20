const { getAction } = require('./get.controller')
const { getSentencePlanObjectiveAction } = require('../../common/data/sentencePlanningApi')
const { getActionDescriptionIntervention } = require('./interventionList/get.controller')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  getSentencePlanObjectiveAction: jest.fn(),
}))
jest.mock('./interventionList/get.controller', () => ({
  getActionDescriptionIntervention: jest.fn(() => ({ intervention: '', description: '' })),
}))
jest.mock('./targetDate/get.controller', () => ({
  getTargetDate: jest.fn(() => ({ targetDateMonth: '', targetDateYear: '' })),
}))
jest.mock('./motivations/get.controller', () => ({
  getMotivation: jest.fn(() => ({ motivationList: [] })),
}))

const actionPresent = require('../../mockServer/sentencePlanActions/1.json')

describe('getAction', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
      objectiveId: '202',
      actionId: 'NEW',
    },
    session: {
      'x-auth-token': '1234',
    },
    body: {},
    errors: {},
    errorSummary: {},
  }
  const res = {
    render: jest.fn(),
  }

  afterEach(() => {
    delete req.body.action
    getSentencePlanObjectiveAction.mockReset()
    getActionDescriptionIntervention.mockReset()
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
    }
    expect(getSentencePlanObjectiveAction).not.toHaveBeenCalled()
    await getAction(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when editing an action', async () => {
    req.params.actionId = '1'
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
    }
    getSentencePlanObjectiveAction.mockReturnValueOnce(actionPresent)
    await getAction(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
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
