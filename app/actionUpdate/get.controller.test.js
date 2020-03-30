const { getActionUpdate } = require('./get.controller')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')
const {
  ACTION_STATUS_TYPES: { NOT_STARTED },
} = require('../../common/utils/constants')

jest.mock('../partials/targetDate/get.controller')
jest.mock('../partials/responsibility/get.controller')
jest.mock('../partials/status/get.controller')

const interventionText = 'Violence booster'

describe.only('getActionUpdate', () => {
  let req
  let res
  let expected
  beforeEach(() => {
    getTargetDate.mockImplementation(() => ({ targetDateMonth: '', targetDateYear: '' }))
    getResponsibility.mockImplementation(() => ({ responsibility: ['OTHER'], responsibilityOther: '' }))
    getStatus.mockImplementation(() => ({ status: 'NOT_STARTED' }))
    req = {
      action: { intervention: '3fa85f64-5717-4562-b3fc-2c963f66afa4', actionText: interventionText },
      interventionList: [{ shortDescription: interventionText, uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa4' }],
      motivationList: [],
      path: '/this/is/my/path',
      errors: {},
      errorSummary: {},
      body: {},
      renderInfo: { timelineData: [] },
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
    jest.resetAllMocks()
  })
  describe('with an intervention', () => {
    it('should get the correct render values and display an intervention', () => {
      getActionUpdate(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
