const controller = require('./get.controller')
const { getSentencePlanObjective, getSentencePlanNeeds } = require('../../common/data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

const objectiveEmpty = {}
const objectivePresent = require('../../mockServer/sentencePlanObjectives/1.json')
const objectiveWithInactiveNeed = require('../../mockServer/sentencePlanObjectives/3.json')

const needsEmpty = []
const needs = require('../../mockServer/sentencePlanNeeds/2.json')
const needsInactive = require('../../mockServer/sentencePlanNeeds/3.json')

const displayNeeds = [
  {
    html: 'Accommodation - <span class="risk"> Risk of serious harm</span>',
    value: 'needsid_accommodation',
    active: true,
  },
  {
    html: 'ETE',
    value: 'needsid_ete',
    active: true,
  },
  {
    html: 'Finance - <span class="risk"> Risk of serious harm</span>',
    value: 'needsid_finance',
    active: true,
  },
]

const displayNeedsProcessed = [
  {
    html: 'Accommodation - <span class="risk"> Risk of serious harm</span>',
    value: 'needsid_accommodation',
    checked: true,
    active: true,
  },
  {
    html: 'ETE',
    value: 'needsid_ete',
    active: true,
  },
  {
    html: 'Finance - <span class="risk"> Risk of serious harm</span>',
    value: 'needsid_finance',
    active: true,
  },
]

const displayNeedsProcessedWithInactiveNeeds = [
  {
    html: 'Accommodation - <span class="risk"> Risk of serious harm</span>',
    value: 'needsid_accommodation',
    checked: true,
    active: true,
  },
  {
    html: 'ETE',
    value: 'needsid_ete',
    active: true,
  },
  {
    html: 'Finance - <span class="risk"> Risk of serious harm</span>',
    value: 'needsid_finance',
    active: true,
  },
  {
    active: true,
    checked: true,
    html: 'Inactive but previously selected need description',
    value: 'needsid_inactive',
  },
]

describe('getObjective', () => {
  const req = {
    path: '/this/is/my/path',
    params: {
      planId: 1,
      objectiveId: 'NEW',
    },
    headers: {
      'x-auth-token': '1234',
    },
    session: {},
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
  })

  afterEach(() => {
    getSentencePlanObjective.mockReset()
    getSentencePlanNeeds.mockReset()
  })

  it('should set the correct render values when adding a new objective', async () => {
    getSentencePlanNeeds.mockReturnValueOnce(needs)
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      description: '',
      displayNeeds,
    }
    getSentencePlanObjective.mockReturnValueOnce(objectiveEmpty)
    await controller.getObjective(req, res)
    expect(req.session.noNeedsAvailable).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('sets flag in session when there are no needs', async () => {
    getSentencePlanNeeds.mockReturnValueOnce(needsEmpty)
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      description: '',
      displayNeeds: [],
    }
    await controller.getObjective(req, res)
    expect(req.session.noNeedsAvailable).toEqual(true)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should set the correct render values when editing an objective', async () => {
    getSentencePlanNeeds.mockReturnValueOnce(needs)
    req.params.objectiveId = '1'
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      description: 'newly created objective',
      displayNeeds: displayNeedsProcessed,
    }
    getSentencePlanObjective.mockReturnValueOnce(objectivePresent)
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should not display inactive needs unless previously selected', async () => {
    req.params.objectiveId = '1'
    getSentencePlanNeeds.mockReturnValueOnce(needsInactive)
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      errorSummary: {},
      errors: {},
      description: 'objective with inactive need',
      displayNeeds: displayNeedsProcessedWithInactiveNeeds,
    }
    getSentencePlanObjective.mockReturnValueOnce(objectiveWithInactiveNeed)
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })

  it('should pass through any renderInfo or objective information', async () => {
    getSentencePlanNeeds.mockReturnValueOnce(needs)
    req.body.objective = 'A random objective text'
    req.body.needs = ['need1', 'need2']
    req.renderInfo = {
      testItem1: true,
      textItem: 'hello',
    }
    const expected = {
      backurl: '/this/is',
      nexturl: '/this/is/my',
      description: 'A random objective text',
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

  it('should display an error if unable to retrieve needs', async () => {
    const theError = new Error('Error message')
    getSentencePlanNeeds.mockImplementation(() => {
      throw theError
    })
    getSentencePlanObjective.mockReturnValueOnce(objectivePresent)
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
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
      description: '',
      displayNeeds,
    }
    await controller.getObjective(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
})
