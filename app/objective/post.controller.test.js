const controller = require('./post.controller')
const { addSentencePlanObjective, updateSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { getObjective } = require('./get.controller')
const returnedObjective = require('../../mockServer/sentencePlanObjectives/1.json')

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('./get.controller')

let req

beforeEach(() => {
  req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
      objectiveId: 'NEW',
    },
    session: {
      'x-auth-token': '1234',
    },
    body: {},
    renderInfo: null,
  }
  updateSentencePlanObjective.mockReset()
  addSentencePlanObjective.mockReset()
})

const expected = {
  path: '/this/is/my/path',
  params: {
    planId: 1,
    objectiveId: 'NEW',
  },
  session: {
    'x-auth-token': '1234',
  },
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

  it('should save the new objective when there are no errors', async () => {
    req.body.objective = 'The objective description'
    req.body.needs = ['needsid_ete', 'needsid_finance']
    addSentencePlanObjective.mockReturnValueOnce(returnedObjective)
    await controller.postObjective(req, res)
    expect(addSentencePlanObjective).toHaveBeenCalledWith(
      1,
      { description: 'The objective description', needs: ['needsid_ete', 'needsid_finance'] },
      '1234'
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
      '1234'
    )
    expect(addSentencePlanObjective).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/this/is')
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
})
