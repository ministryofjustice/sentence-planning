const controller = require('./post.controller')
const { addSentencePlanObjective, updateSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { getObjective } = require('./get.controller')
const returnedObjective = require('../../mockServer/sentencePlanObjectives/1.json')

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('./get.controller')

let req
const tokens = { authorisationToken: 'mytoken' }

beforeEach(() => {
  req = {
    path: 'individual-id/1/edit-plan/1/edit-objective/1',
    params: {
      planId: 1,
      objectiveId: 'NEW',
    },
    tokens,
    session: {},
    body: {},
    renderInfo: null,
  }
  updateSentencePlanObjective.mockReset()
  addSentencePlanObjective.mockReset()
})

const expected = {
  path: 'individual-id/1/edit-plan/1/edit-objective/1',
  session: {},
  params: {
    planId: 1,
    objectiveId: 'NEW',
  },
  tokens,
  body: {
    objective: 'The objective description',
    needs: ['needsid_ete', 'needsid_finance'],
  },
  errors: {
    errors: [
      {
        location: 'body',
        msg: 'Error message',
        param: 'objective',
        value: '',
      },
    ],
  },
  renderInfo: {
    wordsOver: 0,
  },
}

describe('post or update objective', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  it('ignores needs error when noNeedsAvailable is set on session', async () => {
    req.body.needs = []
    req.session.noNeedsAvailable = true
    req.errors = { needs: { text: 'Select the needs for this objective' } }
    await controller.postObjective(req, res)
    expect(addSentencePlanObjective).toHaveBeenCalled()
    expect(updateSentencePlanObjective).not.toHaveBeenCalled()
    expect(getObjective).not.toHaveBeenCalled()
  })

  it('should save the new objective when there are no errors', async () => {
    req.body.objective = 'The objective description'
    req.body.needs = ['needsid_ete', 'needsid_finance']
    addSentencePlanObjective.mockReturnValueOnce(returnedObjective)
    await controller.postObjective(req, res)
    expect(addSentencePlanObjective).toHaveBeenCalledWith(
      1,
      { description: 'The objective description', needs: ['needsid_ete', 'needsid_finance'] },
      tokens
    )
    expect(updateSentencePlanObjective).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('1/edit-action/NEW')
  })

  it('should update the objective when there are no errors', async () => {
    req.params.objectiveId = '1'
    req.body.objective = 'The objective description'
    req.body.needs = ['needsid_ete']
    addSentencePlanObjective.mockReturnValueOnce(returnedObjective)
    await controller.postObjective(req, res)
    expect(updateSentencePlanObjective).toHaveBeenCalledWith(
      1,
      '1',
      { description: 'The objective description', needs: ['needsid_ete'] },
      tokens
    )
    expect(addSentencePlanObjective).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('1/review')
  })

  it('should redisplay the page when there are errors', async () => {
    addSentencePlanObjective.mockReturnValueOnce(returnedObjective)
    req.body.objective = 'The objective description'
    req.body.needs = ['needsid_ete', 'needsid_finance']
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'objective',
          location: 'body',
        },
      ],
    }
    await controller.postObjective(req, res)
    expect(addSentencePlanObjective).not.toHaveBeenCalled()
    expect(updateSentencePlanObjective).not.toHaveBeenCalled()
    expect(getObjective).toHaveBeenCalledWith(expected, res)
  })

  it('sets the wordsOver value', async () => {
    req.body.objective = Array(255).join('word ')
    req.body.needs = ['needsid_ete', 'needsid_finance']
    req.tooManyWords = true
    req.errors = {
      errors: [
        {
          value: '',
          msg: 'Error message',
          param: 'objective',
          location: 'body',
        },
      ],
    }
    expected.body.objective = Array(255).join('word ')
    expected.tooManyWords = true
    expected.renderInfo.wordsOver = 204
    await controller.postObjective(req, res)
    expect(addSentencePlanObjective).not.toHaveBeenCalled()
    expect(updateSentencePlanObjective).not.toHaveBeenCalled()
    expect(getObjective).toHaveBeenCalledWith(expected, res)
  })
  it('should display an error if objective saving fails', async () => {
    const theError = new Error('Error message')
    addSentencePlanObjective.mockImplementation(() => {
      throw theError
    })
    await controller.postObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
  it('should display an error if objective updating fails', async () => {
    req.params.objectiveId = '1'
    const theError = new Error('Error message')
    updateSentencePlanObjective.mockImplementation(() => {
      throw theError
    })
    await controller.postObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
  it('should alter the redirect render', async () => {
    req.path = 'individual-id/1/plan/1/edit-objective/NEW'
    req.body.objective = 'The objective description'
    req.body.needs = ['needsid_ete', 'needsid_finance']
    addSentencePlanObjective.mockReturnValueOnce(returnedObjective)
    await controller.postObjective(req, res)
    expect(addSentencePlanObjective).toHaveBeenCalledWith(
      1,
      { description: 'The objective description', needs: ['needsid_ete', 'needsid_finance'] },
      tokens
    )
    expect(res.redirect).toHaveBeenCalledWith('individual-id/1/plan/1/objective/1/edit-action/NEW')
  })
})
