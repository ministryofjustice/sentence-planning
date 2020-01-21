const { getMotivation } = require('./get.controller')
const { getMotivations } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi', () => ({
  getMotivations: jest.fn(),
}))

const motivations = [
  {
    friendlyText: 'In the dark',
    motivationText: 'text to discard',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
  },
  {
    friendlyText: 'Doing it',
    motivationText: 'more text to discard',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa2',
  },
  {
    friendlyText: 'Off track',
    motivationText: 'the final text to discard',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa3',
  },
]

describe('getMotivation', () => {
  const actionMotivation = { motivationUUID: '3fa85f64-5717-4562-b3fc-2c963f66afa1' }
  const bodyMotivation = { motivation: '3fa85f64-5717-4562-b3fc-2c963f66afa3' }
  const token = 'token_123'

  let motivationList
  beforeEach(() => {
    motivationList = [
      { text: 'In the dark', value: '3fa85f64-5717-4562-b3fc-2c963f66afa1', checked: false },
      { text: 'Doing it', value: '3fa85f64-5717-4562-b3fc-2c963f66afa2', checked: false },
      { text: 'Off track', value: '3fa85f64-5717-4562-b3fc-2c963f66afa3', checked: false },
    ]
    getMotivations.mockReturnValueOnce(motivations)
  })
  afterEach(() => {
    getMotivations.mockReset()
  })

  describe('a blank action', () => {
    let returnedAction
    beforeEach(async () => {
      returnedAction = await getMotivation({}, {}, token)
    })
    it('should retrieve the motivations', () => {
      expect(getMotivations).toHaveBeenCalledWith(token)
    })
    it('should return the processed motivationList', () => {
      expect(returnedAction).toEqual({ motivationList })
    })
  })
  describe('should return persisted values', () => {
    it('should return the processed motivationList', async () => {
      motivationList[0].checked = true
      const returnedAction = await getMotivation(actionMotivation, {}, token)
      expect(returnedAction).toEqual({ motivationList })
    })
  })
  describe('Values from the body should override persisted ones', () => {
    it('should return the processed body values', async () => {
      motivationList[2].checked = true
      const returnedAction = await getMotivation(actionMotivation, bodyMotivation, token)
      expect(returnedAction).toEqual({ motivationList })
    })
  })
})
