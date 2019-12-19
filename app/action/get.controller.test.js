const { getAction } = require('./get.controller')
const { getSentencePlanObjectiveAction } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  getSentencePlanObjectiveAction: jest.fn(),
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

  beforeEach(() => {
    delete req.body.action
    getSentencePlanObjectiveAction.mockReset()
  })

  it('should set the correct render values when adding a new action', async () => {
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
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
      action: actionPresent,
      errorSummary: {},
      errors: {},
    }
    getSentencePlanObjectiveAction.mockReturnValueOnce(actionPresent)
    await getAction(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass through any action information', async () => {
    req.body.action = 'A random action text'
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      action: req.body.action,
      errorSummary: {},
      errors: {},
    }
    getSentencePlanObjectiveAction.mockReturnValueOnce(actionPresent)
    await getAction(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
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
