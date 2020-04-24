const getOffenderDetails = require('./getOffenderDetails')
const { getOffenderData } = require('../data/sentencePlanningApi')

jest.mock('../../common/data/sentencePlanningApi')

describe('getOffenderDetails middleware', () => {
  let mockOffenderData
  let req
  let res
  const next = jest.fn()
  const render = jest.fn()
  const id = '0118 999 881 999 119 7253'
  const tokens = {}
  beforeEach(() => {
    mockOffenderData = {
      familyName: 'Shakey',
      forename1: 'Bernard',
      crn: 'S000001',
      nomisId: 'A0000AB',
      unnecessary: 'values',
      riskToOthers: 'H',
    }
    req = { tokens, params: { id } }
    res = { render, locals: {} }
    getOffenderData.mockResolvedValue(mockOffenderData)
  })
  afterEach(() => {
    getOffenderData.mockReset()
    next.mockReset()
    render.mockReset()
  })
  describe('with complete data', () => {
    beforeEach(async () => {
      await getOffenderDetails(req, res, next)
    })
    it('should return an object with the required values', () => {
      expect(res.locals.offenderDetails).toEqual({
        fullName: 'Bernard Shakey',
        crn: 'S000001',
        noms: 'A0000AB',
        riskLevel: 'High',
      })
    })
    it('should call the data service once and pass the id', () => {
      expect(getOffenderData).toHaveBeenCalledTimes(1)
      expect(getOffenderData).toHaveBeenCalledWith(id, tokens)
    })
    it('should call the next function', () => {
      expect(next).toHaveBeenCalledTimes(1)
      expect(render).not.toHaveBeenCalled()
    })
  })
  describe('without certain optional data', () => {
    beforeEach(async () => {
      mockOffenderData.crn = 'S000002'
      mockOffenderData.nomisId = null
      await getOffenderDetails(req, res, next)
    })
    it('should handle ommited optional values', () => {
      expect(res.locals.offenderDetails).toEqual({
        fullName: 'Bernard Shakey',
        crn: 'S000002',
        noms: null,
        riskLevel: 'High',
      })
    })
    it('should call the next function', () => {
      expect(next).toHaveBeenCalledTimes(1)
      expect(render).not.toHaveBeenCalled()
    })
  })
  describe('without certain required data', () => {
    beforeEach(async () => {
      delete mockOffenderData.forename1
      delete mockOffenderData.crn
      await getOffenderDetails(req, res, next)
    })
    it('should render the error page', async () => {
      expect(next).not.toHaveBeenCalled()
      expect(render).toHaveBeenCalledWith(`app/error`, {
        error: new Error('Required offender details could not be found'),
      })
    })
  })
})
