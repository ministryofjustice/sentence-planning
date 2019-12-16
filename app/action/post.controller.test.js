const { postAction } = require('./post.controller')
const {
  addSentencePlanObjectiveAction,
  updateSentencePlanObjectiveAction,
} = require('../../common/data/sentencePlanningApi')
const { getAction } = require('./get.controller')
const returnedAction = require('../../mockServer/sentencePlanActions/1.json')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  addSentencePlanObjectiveAction: jest.fn(),
  updateSentencePlanObjectiveAction: jest.fn(),
}))
jest.mock('./get.controller')

let req
let res

const token = '1234'
const planId = '1'
const objectiveId = '2'

beforeEach(() => {
  req = {
    path: '/this/is/my/path',
    params: {
      planId,
      objectiveId,
      actionId: 'NEW',
    },
    session: {
      'x-auth-token': token,
    },
    body: {},
    renderInfo: null,
  }
  updateSentencePlanObjectiveAction.mockReset()
  addSentencePlanObjectiveAction.mockReset()
  res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
})

describe('add a new action', () => {
  describe('when the user wants to "Add another action"', () => {
    let expectedAction
    beforeEach(() => {
      req.body.addAnotherAction = ''
      expectedAction = { ...returnedAction, ...req.body }
    })
    it('should save the new action when there are no errors', async () => {
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).toHaveBeenCalledWith(planId, objectiveId, expectedAction, token)
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/this/is/my/NEW')
    })

    it('should redisplay the page when there are errors', async () => {
      req.errors = {
        errors: [
          {
            value: '',
            msg: 'Error message',
            param: 'action',
            location: 'body',
          },
        ],
      }
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(getAction).toHaveBeenCalledWith(req, res)
    })
    it('should display an error if action saving fails', async () => {
      const theError = new Error('Error message')
      addSentencePlanObjectiveAction.mockImplementation(() => {
        throw theError
      })
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).toHaveBeenCalled()
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
  describe('when the user wants to review the objective and action', () => {
    let expectedAction
    beforeEach(() => {
      expectedAction = { ...returnedAction, ...req.body }
    })
    it('should save the new action when there are no errors', async () => {
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).toHaveBeenCalledWith(planId, objectiveId, expectedAction, token)
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/this/is/review')
    })
  })
})
describe('update an existing action', () => {
  describe('when the user wants to "Add another action"', () => {
    let expectedAction
    beforeEach(() => {
      req.params.actionId = '313'
      req.body.addAnotherAction = ''
      expectedAction = { ...returnedAction, ...req.body }
    })
    it('should save the new action when there are no errors', async () => {
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(updateSentencePlanObjectiveAction).toHaveBeenCalledWith('1', '2', '313', expectedAction, token)
      expect(res.redirect).toHaveBeenCalledWith('/this/is/my/NEW')
    })
    it('should display an error if action saving fails', async () => {
      const theError = new Error('Error message')
      updateSentencePlanObjectiveAction.mockImplementation(() => {
        throw theError
      })
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(updateSentencePlanObjectiveAction).toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
