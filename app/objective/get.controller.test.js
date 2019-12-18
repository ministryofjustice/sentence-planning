const controller = require('./get.controller')
const { getSentencePlanObjective, getSentencePlanNeeds } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

const objectiveEmpty = {}
const objectivePresent = require('../../mockServer/sentencePlanObjectives/1.json')
const needs = require('../../mockServer/sentencePlanNeeds/2.json')

const displayNeeds = [
  {
    html: 'Accommodation - <span class="risk"> Risk of serious harm',
    value: 'needsid_accommodation',
  },
  {
    html: 'ETE',
    value: 'needsid_ete',
  },
  {
    html: 'Finance - <span class="risk"> Risk of serious harm',
    value: 'needsid_finance',
  },
]

const displayNeedsProcessed = [
  {
    html: 'Accommodation - <span class="risk"> Risk of serious harm',
    value: 'needsid_accommodation',
    checked: true,
  },
  {
    html: 'ETE',
    value: 'needsid_ete',
  },
  {
    html: 'Finance - <span class="risk"> Risk of serious harm',
    value: 'needsid_finance',
  },
]

describe('getObjective', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
      objectiveId: 'NEW',
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
    req.renderInfo = {}
    req.params.objectiveId = 'NEW'
    delete req.body.objective
    getSentencePlanNeeds.mockReturnValueOnce(needs)
  })

  afterEach(() => {
    getSentencePlanObjective.mockReset()
    getSentencePlanNeeds.mockReset()
  })

  it('should set the correct render values when adding a new objective', async () => {
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      displayNeeds,
      objective: {},
    }
    getSentencePlanObjective.mockReturnValueOnce(objectiveEmpty)
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when editing an objective', async () => {
    req.params.objectiveId = '1'
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      objective: objectivePresent,
      errorSummary: {},
      errors: {},
      displayNeeds: displayNeedsProcessed,
    }
    getSentencePlanObjective.mockReturnValueOnce(objectivePresent)
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass through any renderInfo or objective information', async () => {
    req.body.objective = 'A random objective text'
    req.renderInfo = {
      testItem1: true,
      textItem: 'hello',
    }
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      objective: 'A random objective text',
      errorSummary: {},
      errors: {},
      testItem1: true,
      textItem: 'hello',
      displayNeeds,
    }
    getSentencePlanObjective.mockReturnValueOnce(objectivePresent)
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should display an error if unable to retrieve objective', async () => {
    req.params.objectiveId = '1'
    const theError = new Error('Error message')
    getSentencePlanObjective.mockImplementation(() => {
      throw theError
    })
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
  it('copes with an empty renderInfo', async () => {
    delete req.renderInfo
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      displayNeeds,
    }
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
})
