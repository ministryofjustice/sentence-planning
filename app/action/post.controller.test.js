const { postAction } = require('./post.controller')
const {
  addSentencePlanObjectiveAction,
  updateSentencePlanObjectiveAction,
} = require('../../common/data/sentencePlanningApi')
const { getAction } = require('./get.controller')
const returnedAction = require('../../mockServer/sentencePlanActions/1.json')
const { postActionDescriptionIntervention } = require('./interventionList/post.controller')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  addSentencePlanObjectiveAction: jest.fn(),
  updateSentencePlanObjectiveAction: jest.fn(),
}))
jest.mock('./interventionList/post.controller', () => ({
  postActionDescriptionIntervention: jest.fn(() => ({})),
}))
jest.mock('./targetDate/post.controller', () => ({
  postTargetDate: jest.fn(() => ({})),
}))
jest.mock('./responsibility/post.controller', () => ({
  postResponsibility: jest.fn(() => ({})),
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
    headers: {
      'x-auth-token': token,
    },
    body: {
      motivation: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      status: 'NOT_STARTED',
    },
    renderInfo: null,
  }
  updateSentencePlanObjectiveAction.mockReset()
  addSentencePlanObjectiveAction.mockReset()
  postActionDescriptionIntervention.mockReset()

  res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
})

describe('add a new action', () => {
  describe('when the user wants to "Add another action"', () => {
    beforeEach(() => {
      req.body.addAnotherAction = ''
    })
    it('should save the new action when there are no errors', async () => {
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).toHaveBeenCalledWith(planId, objectiveId, returnedAction, token)
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/this/is/my/NEW')
    })
    it('should process the action intervention/description', async () => {
      await postAction(req, res)
      expect(postActionDescriptionIntervention).toHaveBeenCalled()
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
      expectedAction = { ...returnedAction }
    })
    it('should save the new action when there are no errors', async () => {
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).toHaveBeenCalledWith(planId, objectiveId, expectedAction, token)
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/this/is/review')
    })
  })
  describe('with an active plan', () => {
    it('should save the new action and redirect to the active plan "Objective and actions" page', async () => {
      const expectedAction = { ...returnedAction }
      req.path = '/plan/1/objective/edit-action/NEW'
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).toHaveBeenCalledWith(planId, objectiveId, expectedAction, token)
      expect(updateSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/plan/1/objective')
    })
  })
})
describe('update an existing action', () => {
  describe('when the user wants to "Add another action"', () => {
    beforeEach(() => {
      req.params.actionId = '313'
      req.body.addAnotherAction = ''
    })
    it('should save the new action when there are no errors', async () => {
      await postAction(req, res)
      expect(addSentencePlanObjectiveAction).not.toHaveBeenCalled()
      expect(updateSentencePlanObjectiveAction).toHaveBeenCalledWith('1', '2', '313', returnedAction, token)
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
