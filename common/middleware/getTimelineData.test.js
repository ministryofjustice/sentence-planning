const {
  processProgress,
  appendActionCreated,
  getOwnerString,
  getActionTimelineData,
  getObjectiveTimelineData,
  processStatusChanges,
  processAction,
} = require('./getTimelineData')
const {
  ACTION_RESPONSIBLE_TYPES: { SERVICE_USER, PRACTITIONER, OTHER },
  ACTION_STATUS_TYPES: { PARTIALLY_COMPLETED, IN_PROGRESS },
} = require('../../common/utils/constants')

describe('getTimelineData', () => {
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
  let action1
  let expectedAction1
  let expectedObjectiveAction1
  let progress1
  let progress2
  let progress3
  let expected1
  let expected2
  let expected3
  let statusChanges
  let statusChange1
  let statusChange2
  let expectedStatusChange1
  let expectedStatusChange2
  beforeEach(() => {
    progress1 = {
      status: PARTIALLY_COMPLETED,
      targetDate: '2020-10',
      motivationUUID: '55f90269-1d93-4a9a-921a-7bae73f3bf07',
      owner: [SERVICE_USER],
      comment: 'Thank you for your kind applause.',
      created: '2020-02-29T00:13:27.59747',
      createdBy: 'Edith Artois',
    }
    progress2 = {
      status: PARTIALLY_COMPLETED,
      targetDate: '2020-10',
      motivationUUID: '13395347-f226-4cc3-abcf-9dbc224c0f50',
      comment: 'It is I.',
      created: '2020-02-22T11:20:00',
      createdBy: 'Roger LeClerc',
    }
    progress3 = {
      status: IN_PROGRESS,
      targetDate: '',
      motivationUUID: '',
      comment: 'Listen very carefully, I shall say zis only once.',
      created: '2019-10-15T11:20:00',
      createdBy: 'Michelle Dubois',
    }
    expected1 = {
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
      description: '',
    }
    expected2 = {
      created: '2020-02-22T11:20:00',
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
      description: '',
    }
    expected3 = {
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
      description: '',
    }
    action1 = {
      created: '2020-06-18T00:13:27.59747',
      actionText: 'the action description',
      progress: [progress1],
    }
    expectedAction1 = [
      { ...expected1, description: '' },
      {
        type: 'Action Created',
        created: '2020-06-18T00:13:27.59747',
        description: '',
      },
    ]
    expectedObjectiveAction1 = [
      { ...expected1, description: 'the action description' },
      {
        type: 'Action Created',
        created: '2020-06-18T00:13:27.59747',
        description: 'the action description',
      },
    ]
    statusChange1 = {
      status: 'CLOSED',
      comment: 'Its completed',
      created: '2020-04-25T00:13:27.59747',
      createdBy: 'Robert McKenna',
    }
    statusChange2 = {
      status: 'OPEN',
      comment: 'It is not you know',
      created: '2020-07-19T00:13:27.59747',
      createdBy: 'Stavro Mueller',
    }
    statusChanges = [statusChange1, statusChange2]
    expectedStatusChange1 = {
      type: 'Objective Updated',
      created: '2020-04-25T00:13:27.59747',
      createdBy: 'Robert McKenna',
      data: [
        { key: 'Status', value: 'CLOSED' },
        { key: 'Comment', value: 'Its completed' },
      ],
    }
    expectedStatusChange2 = {
      type: 'Objective Updated',
      created: '2020-07-19T00:13:27.59747',
      createdBy: 'Stavro Mueller',
      data: [
        { key: 'Status', value: 'OPEN' },
        { key: 'Comment', value: 'It is not you know' },
      ],
    }
  })

  describe('appendActionCreated', () => {
    let timelineData
    beforeEach(() => {
      timelineData = [{ type: 'Event', created: '2015-10' }]
    })
    describe('with a created date', () => {
      it('should add a timeline entry if created is defined', () => {
        const created = '1987-11'
        const expected = [...timelineData, { type: 'Action Created', created }]
        appendActionCreated(timelineData, created)
        expect(timelineData).toEqual(expected)
      })
    })
    describe('without a created date', () => {
      it('should add a timeline entry if created is defined', () => {
        const expected = [...timelineData]
        appendActionCreated(timelineData)
        expect(timelineData).toEqual(expected)
      })
    })
  })

  describe('processProgress', () => {
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
  describe('getOwnerString', () => {
    describe('with owner defined', () => {
      describe('with a single owner', () => {
        it('should return a friendly text string', () => expect(getOwnerString([OTHER])).toEqual('Other'))
      })
      describe('with a multiple owners', () => {
        it('should return a comma separated friendly text string', () =>
          expect(getOwnerString([SERVICE_USER, PRACTITIONER, OTHER])).toEqual('Individual, Offender manager, Other'))
      })
    })
    describe('with owner "falsey"', () => {
      it('should return an empty string', () => expect(getOwnerString()).toEqual(''))
    })
  })
  describe('processAction', () => {
    it('should return a timeline Array including a description', () => {
      const timelineData = processAction(action1, motivationList, true)
      expect(timelineData).toEqual(expectedObjectiveAction1)
    })
    it('should return an timeline Array without a description', () => {
      const timelineData = processAction(action1, motivationList)
      expect(timelineData).toEqual(expectedAction1)
    })
  })
  describe('processStatusChanges', () => {
    it('should return an timeline Array', () => {
      expect(processStatusChanges(statusChanges)).toEqual([expectedStatusChange1, expectedStatusChange2])
    })
  })
  describe('middleware', () => {
    const next = jest.fn()
    let req
    afterEach(() => next.mockReset())
    describe('getActionTimelineData', () => {
      beforeEach(() => {
        req = { action: action1, motivationList }
        getActionTimelineData(req, {}, next)
      })
      it('should add timeline data to the renderInfo', () => {
        expect(req.renderInfo.timelineData).toEqual(expectedAction1)
      })
      it('should call "next"', () => {
        expect(next).toHaveBeenCalled()
      })
    })
    describe('getObjectiveTimelineData', () => {
      beforeEach(() => {
        const action2 = {
          created: '2020-01-18T00:13:27.59747',
          description: 'another action description',
          progress: [progress2],
        }
        const objective = {
          actions: [action1, action2],
          statusChanges,
          created: '2020-01-18T00:13:27.59747',
          createdBy: 'Paula Nancy Millstone Jennings',
        }
        req = { renderInfo: { objective }, motivationList }
        getObjectiveTimelineData(req, {}, next)
      })
      it('should add timeline data to the renderInfo', () => {
        expect(req.renderInfo.timelineData.length).toEqual(7)
      })
      it('should add "Objective Created" to the timeline Array', () => {
        expect(req.renderInfo.timelineData.pop()).toEqual({
          type: 'Objective Created',
          created: '2020-01-18T00:13:27.59747',
          createdBy: 'Paula Nancy Millstone Jennings',
        })
      })
      it('should call "next"', () => {
        expect(next).toHaveBeenCalled()
      })
    })
  })
})
