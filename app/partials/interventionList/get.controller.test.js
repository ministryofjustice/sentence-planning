const { getActionDescriptionIntervention } = require('./get.controller')
const { getInterventions } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi', () => ({
  getInterventions: jest.fn(),
}))

const interventions = [
  {
    longDescription: 'Long description for Intervention 1',
    shortDescription: 'Intervention 1',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
  },
  {
    longDescription: 'Long description for Intervention 2',
    shortDescription: 'Intervention 2',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa2',
  },
  {
    longDescription: 'Long description for Intervention 3',
    shortDescription: 'Intervention 3',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa3',
  },
]

const interventionList = [
  { text: 'Intervention 1', value: '3fa85f64-5717-4562-b3fc-2c963f66afa1', selected: false },
  { text: 'Intervention 2', value: '3fa85f64-5717-4562-b3fc-2c963f66afa2', selected: false },
  { text: 'Intervention 3', value: '3fa85f64-5717-4562-b3fc-2c963f66afa3', selected: false },
]

describe('getActionDescriptionIntervention', () => {
  const actionIntervention = { intervention: 'Intervention', description: '' }
  const actionDescription = { intervention: '', description: 'A good description.' }
  const bodyInterventionComplete = { actionType: 'intervention', intervention: 'Intervention', description: '' }
  const bodyDescriptionIncomplete = { actionType: 'description', intervention: '', description: '' }
  const token = 'token_123'

  const returnBlank = {
    interventionList,
    interventionId: 'intervention',
    interventionLabel: 'What intervention are they going to take?',
    description: '',
    intervention: '',
    interventionChecked: false,
    descriptionChecked: false,
  }

  const returnActionIntervention = {
    ...returnBlank,
    intervention: 'Intervention',
    description: '',
    interventionChecked: true,
  }

  const returnIncompleteDescription = {
    ...returnBlank,
    descriptionChecked: true,
  }

  beforeEach(() => {
    getInterventions.mockReturnValueOnce(interventions)
  })
  afterEach(() => {
    getInterventions.mockReset()
  })

  describe('a blank action', () => {
    let returnedAction
    beforeEach(async () => {
      returnedAction = await getActionDescriptionIntervention({}, {}, token)
    })
    it('should retrieve the interventions', () => {
      expect(getInterventions).toHaveBeenCalledWith(token)
    })
    it('should return the processed interventionList', () => {
      expect(returnedAction.interventionList).toEqual(interventionList)
    })
    it('should return blank values', () => {
      expect(returnedAction).toEqual(returnBlank)
    })
  })
  describe('should return persisted values', () => {
    let returnedAction
    beforeEach(async () => {
      returnedAction = await getActionDescriptionIntervention(actionIntervention, {}, token)
    })
    it('should return the processed interventionList', () => {
      expect(returnedAction).toEqual(returnActionIntervention)
    })
  })
  describe('Values from the body should override persisted ones', () => {
    let returnedAction
    beforeEach(async () => {
      returnedAction = await getActionDescriptionIntervention(actionDescription, bodyInterventionComplete, token)
    })
    it('should return the processed body values', () => {
      expect(returnedAction).toEqual(returnActionIntervention)
    })
  })
  describe('The action type should be respected even if an action was not defined', () => {
    let returnedAction
    beforeEach(async () => {
      returnedAction = await getActionDescriptionIntervention(actionIntervention, bodyDescriptionIncomplete, token)
    })
    it('should return the empty body values with an active radio button', () => {
      expect(returnedAction).toEqual(returnIncompleteDescription)
    })
  })
})
