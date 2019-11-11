const createOffenderDetailsService = require('./offenderDetails')

describe('service offenderDetails', () => {
  let getOffenderDataMock
  let mockOffenderData
  beforeEach(() => {
    getOffenderDataMock = jest.fn(() => mockOffenderData)
    mockOffenderData = {
      familyName: 'Shakey',
      forename1: 'Bernard',
      identifiers: {
        crn: 'S000001',
        noms: 'A0000AB',
      },
      unnecessary: 'values',
    }
  })
  afterEach(() => {
    getOffenderDataMock.mockReset()
  })
  describe('getOffenderDetails', () => {
    describe('with complete data', () => {
      let offenderDetails
      beforeEach(async () => {
        const offenderDetailsService = createOffenderDetailsService({ getOffenderData: getOffenderDataMock })
        offenderDetails = await offenderDetailsService.getOffenderDetails(417)
      })
      it('should return an object with the required values', () => {
        expect(offenderDetails).toEqual({
          fullName: 'Bernard Shakey',
          crn: 'S000001',
          noms: 'A0000AB',
        })
      })
      it('should call the data service onece and pass the id', () => {
        expect(getOffenderDataMock).toHaveBeenCalled()
        expect(getOffenderDataMock).toHaveBeenCalledWith(417)
      })
    })
  })
  describe('without certain optional data', () => {
    let offenderDetails
    beforeEach(async () => {
      mockOffenderData.identifiers = { crn: 'S000002' }
      const offenderDetailsService = createOffenderDetailsService({ getOffenderData: getOffenderDataMock })
      offenderDetails = await offenderDetailsService.getOffenderDetails(417)
    })
    it('should handle ommited optional values', () => {
      expect(offenderDetails).toEqual({
        fullName: 'Bernard Shakey',
        crn: 'S000002',
        noms: null,
      })
    })
  })
  describe('without certain required data', () => {
    let offenderDetails
    beforeEach(() => {
      mockOffenderData = {
        forename1: 'Bernard',
        identifiers: {
          noms: 'A0000AB',
        },
      }
      const offenderDetailsService = createOffenderDetailsService({ getOffenderData: getOffenderDataMock })
      offenderDetails = offenderDetailsService.getOffenderDetails(417)
    })
    it('should throw an error', async () => {
      await expect(offenderDetails).rejects.toThrow('Required offender details could not be found')
    })
  })
})
