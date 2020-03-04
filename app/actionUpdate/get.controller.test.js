const { getActionUpdate, processProgress } = require('./get.controller')
const { getSentencePlanObjectiveAction, getInterventions } = require('../../common/data/sentencePlanningApi')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getMotivation } = require('../partials/motivations/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')
const {
  ACTION_RESPONSIBLE_TYPES: { SERVICE_USER },
  ACTION_STATUS_TYPES: { NOT_STARTED, PARTIALLY_COMPLETED, IN_PROGRESS },
} = require('../../common/utils/constants')

const mockPromise = (data, error) => () => new Promise((resolve, reject) => (error ? reject(error) : resolve(data)))

jest.mock('../../common/data/sentencePlanningApi')
jest.mock('../partials/targetDate/get.controller')
jest.mock('../partials/motivations/get.controller')
jest.mock('../partials/responsibility/get.controller')
jest.mock('../partials/status/get.controller')

const interventionText = 'Violence booster'
const descriptionText = 'Something wholesome'

describe('getActionUpdate', () => {
  let req
  let res
  let expected
  const token = {
    authorisationToken: 'mytoken',
  }
  beforeEach(() => {
    getInterventions.mockImplementation(
      mockPromise([{ shortDescription: interventionText, uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa4' }])
    )
    getTargetDate.mockImplementation(() => ({ targetDateMonth: '', targetDateYear: '' }))
    getMotivation.mockImplementation(mockPromise({ motivationList: [] }))
    getResponsibility.mockImplementation(() => ({ responsibility: ['OTHER'], responsibilityOther: '' }))
    getStatus.mockImplementation(() => ({ status: 'NOT_STARTED' }))
    req = {
      path: '/this/is/my/path',
      params: {
        planId: 1,
        objectiveId: '202',
        actionId: '1',
      },
      tokens: token,
      body: {},
      errors: {},
      errorSummary: {},
    }
    res = {
      render: jest.fn(),
    }
    expected = {
      backUrl: '/this/is',
      errorSummary: {},
      errors: {},
      actionText: interventionText,
      targetDateMonth: '',
      targetDateYear: '',
      motivationList: [],
      responsibility: ['OTHER'],
      responsibilityOther: '',
      status: NOT_STARTED,
      timelineData: [],
    }
  })

  afterEach(() => {
    delete req.body.action
    jest.resetAllMocks()
  })
  describe('with an intervention', () => {
    beforeEach(() => {
      getSentencePlanObjectiveAction.mockImplementation(
        mockPromise({
          description: '',
          intervention: '3fa85f64-5717-4562-b3fc-2c963f66afa4',
          motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          owner: [SERVICE_USER],
          ownerOther: 'string',
          status: NOT_STARTED,
          targetDate: '2022-04',
        })
      )
    })
    it('should get the correct render values and display an intervention', async () => {
      await getActionUpdate(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should display an error if unable to retrieve action', async () => {
      req.params.actionId = '1'
      const theError = new Error('Error message')
      getSentencePlanObjectiveAction.mockImplementation(() => {
        throw theError
      })
      await getActionUpdate(req, res)
      expect(res.render).toHaveBeenCalledWith(
        `app/error`,
        expect.objectContaining({
          error: expect.objectContaining({ message: expect.stringContaining(theError.toString()) }),
        })
      )
    })
  })
  describe('with a created date', () => {
    beforeEach(() => {
      getSentencePlanObjectiveAction.mockImplementation(
        mockPromise({
          description: '',
          intervention: '3fa85f64-5717-4562-b3fc-2c963f66afa4',
          motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          owner: [SERVICE_USER],
          ownerOther: 'string',
          status: NOT_STARTED,
          targetDate: '2022-04',
          created: '2020-01',
        })
      )
      expected.timelineData = [{ type: 'Action Created', created: '2020-01' }]
    })
    it('should add a timeline entry if created is defined', async () => {
      await getActionUpdate(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
  describe('with a description action', () => {
    beforeEach(() => {
      getSentencePlanObjectiveAction.mockImplementation(
        mockPromise({
          description: descriptionText,
          intervention: '',
          motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          owner: ['SERVICE_USER'],
          ownerOther: 'string',
          status: NOT_STARTED,
          targetDate: '2022-04',
        })
      )
      expected.actionText = descriptionText
      expected.timelineData = []
    })
    it('should get the correct render values and display the description action', async () => {
      await getActionUpdate(req, res)
      expect(getInterventions).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})

describe('processProgress', () => {
  const motivationList = [
    {
      text: 'Not aware of It',
      value: '38731914-701d-4b4e-abd3-1e0a6375f0b2',
    },
    {
      text: 'Thinking about it',
      value: '82c563d5-00de-4e17-af88-c0363c4d91cc',
    },
    {
      text: 'Getting ready',
      value: '55f90269-1d93-4a9a-921a-7bae73f3bf07',
    },
    {
      text: 'Doing it',
      value: '13395347-f226-4cc3-abcf-9dbc224c0f50',
    },
    {
      text: 'Keeping going',
      value: '42de6207-7a3a-4ffb-9b45-c3ee4ea514fa',
    },
    {
      text: 'On track',
      value: '76e7770b-2a66-40e4-88b8-ccd038501906',
    },
  ]
  const progress1 = {
    status: PARTIALLY_COMPLETED,
    targetDate: '2020-10',
    motivationUUID: '55f90269-1d93-4a9a-921a-7bae73f3bf07',
    owner: SERVICE_USER,
    comment: 'Thank you for your kind applause.',
    created: '2020-02-29T00:13:27.59747',
    createdBy: 'Edith Artois',
  }
  const progress2 = {
    status: PARTIALLY_COMPLETED,
    targetDate: '2020-10',
    motivationUUID: '13395347-f226-4cc3-abcf-9dbc224c0f50',
    comment: 'It is I.',
    created: '2019-11-15T11:20:00',
    createdBy: 'Roger LeClerc',
  }
  const progress3 = {
    status: IN_PROGRESS,
    targetDate: '',
    motivationUUID: '',
    comment: 'Listen very carefully, I shall say zis only once.',
    created: '2019-10-15T11:20:00',
    createdBy: 'Michelle Dubois',
  }
  const expected1 = {
    created: '2020-02-29T00:13:27.59747',
    createdBy: 'Edith Artois',
    data: [
      {
        key: 'Status',
        value: 'Partially completed',
      },
      {
        key: 'Target date',
        value: '2020-10',
      },
      {
        key: 'Motivation',
        value: 'Getting ready',
      },
      {
        key: 'Owner',
        value: 'Individual',
      },
      {
        key: 'Comment',
        value: 'Thank you for your kind applause.',
      },
    ],
    type: 'Action Updated',
  }
  const expected2 = {
    created: '2019-11-15T11:20:00',
    createdBy: 'Roger LeClerc',
    data: [
      {
        key: 'Status',
        value: 'Partially completed',
      },
      {
        key: 'Target date',
        value: '2020-10',
      },
      {
        key: 'Motivation',
        value: 'Doing it',
      },
      {
        key: 'Comment',
        value: 'It is I.',
      },
    ],
    type: 'Action Updated',
  }

  const expected3 = {
    created: '2019-10-15T11:20:00',
    createdBy: 'Michelle Dubois',
    data: [
      {
        key: 'Status',
        value: 'In progress',
      },
      {
        key: 'Comment',
        value: 'Listen very carefully, I shall say zis only once.',
      },
    ],
    type: 'Action Updated',
  }
  it('should reformat the progress objects', () => {
    const progress = [progress1]
    const expected = [expected1]
    expect(processProgress(progress, motivationList)).toEqual(expected)
  })
  it('should reverse the progress array', () => {
    const progress = [progress1, progress2]
    const expected = [expected2, expected1]
    expect(processProgress(progress, motivationList)).toEqual(expected)
  })
  it('should remove any blank data fields', () => {
    const progress = [progress3]
    const expected = [expected3]
    expect(processProgress(progress, motivationList)).toEqual(expected)
  })
})
