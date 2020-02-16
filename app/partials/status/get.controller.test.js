const { getStatus } = require('./get.controller')

jest.mock('../../../common/utils/util', () => ({
  STATUS_LIST: [
    { text: 'AT', value: 'AV', initialStatus: true },
    { text: 'BT', value: 'BV', initialStatus: true },
    { text: 'CT', value: 'CV' },
  ],
}))

describe('getStatus', () => {
  const actionStatusValue = 'AV'
  const bodyStatusValue = 'BV'
  const actionStatus = { status: actionStatusValue }
  const bodyStatus = { status: bodyStatusValue }
  describe('in action definitions', () => {
    it('should return only the initial status items', () => {
      const expectedStatusItems = [
        { text: 'AT', value: 'AV', checked: false },
        { text: 'BT', value: 'BV', checked: false },
      ]
      expect(getStatus({}, {}, true)).toEqual({ status: '', statusItems: expectedStatusItems })
    })
    describe('should return persisted values', () => {
      it('should return the processed motivationList', () => {
        const expectedStatusItems = [
          { text: 'AT', value: 'AV', checked: true },
          { text: 'BT', value: 'BV', checked: false },
        ]
        expect(getStatus(actionStatus, {}, true)).toEqual({
          status: actionStatusValue,
          statusItems: expectedStatusItems,
        })
      })
    })
    describe('Values from the body should override persisted ones', () => {
      it('should return the processed body values', () => {
        const expectedStatusItems = [
          { text: 'AT', value: 'AV', checked: false },
          { text: 'BT', value: 'BV', checked: true },
        ]
        expect(getStatus(actionStatus, bodyStatus, true)).toEqual({
          status: bodyStatusValue,
          statusItems: expectedStatusItems,
        })
      })
    })
  })
  describe('in action progress', () => {
    let expectedStatusItems
    beforeEach(() => {
      expectedStatusItems = [
        { text: 'AT', value: 'AV', checked: false },
        { text: 'BT', value: 'BV', checked: false },
        { text: 'CT', value: 'CV', checked: false },
      ]
    })
    it('should return all status items', () => {
      expect(getStatus({}, {})).toEqual({ status: '', statusItems: expectedStatusItems })
    })
  })
})
