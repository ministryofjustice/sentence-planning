const serviceCreator = require('./sentencePlanningService')

const token = 'token-1'

const sentencePlanningClient = {
  getSentencePlans: jest.fn(),
  getSentencePlan: jest.fn(),
  getSentencePlanStep: jest.fn(),
  getSentencePlanNeeds: jest.fn(),
}

const sentencePlanningClientBuilder = jest.fn()

let service

beforeEach(() => {
  sentencePlanningClientBuilder.mockReturnValue(sentencePlanningClient)
  service = serviceCreator(sentencePlanningClientBuilder)
})

afterEach(() => {
  sentencePlanningClient.getSentencePlans.mockReset()
  sentencePlanningClient.getSentencePlan.mockReset()
  sentencePlanningClient.getSentencePlanStep.mockReset()
  sentencePlanningClient.getSentencePlanNeeds.mockReset()
})

describe('getSentencePlans', () => {
  it('should return an Array of Sentence Plans', async () => {
    const sentencePlans = [
      {
        planId: '11111111-1111-1111-1111-111111111111',
        createdDate: '2019-06-27',
        completedDate: '2019-06-27',
        legacy: false,
      },
      {
        planId: '11032',
        createdDate: '2012-10-16',
        completedDate: '2011-09-28',
        legacy: true,
      },
    ]
    sentencePlanningClient.getSentencePlans.mockReturnValue(sentencePlans)

    const result = await service.getSentencePlans(token, '418')

    expect(result).toEqual(sentencePlans)
  })

  it('should use the user token', async () => {
    sentencePlanningClient.getSentencePlans.mockReturnValue([])
    await service.getSentencePlans(token, '418')

    expect(sentencePlanningClientBuilder).toBeCalledWith(token)
  })
})

describe('getSentencePlan', () => {
  it('should return a Sentence Plan JSON object', async () => {
    const sentencePlan = { id: '218', steps: [] }
    sentencePlanningClient.getSentencePlan.mockReturnValue(sentencePlan)

    const result = await service.getSentencePlan(token, '218')

    expect(result).toEqual(sentencePlan)
  })

  it('should use the user token', async () => {
    sentencePlanningClient.getSentencePlan.mockReturnValue({})
    await service.getSentencePlan(token, '218')

    expect(sentencePlanningClientBuilder).toBeCalledWith(token)
  })
})

describe('getSentencePlanStep', () => {
  it('should return a Step JSON object', async () => {
    const step = { id: '218', progress: [] }
    sentencePlanningClient.getSentencePlanStep.mockReturnValue(step)

    const result = await service.getSentencePlanStep(token, '218', '418')

    expect(result).toEqual(step)
  })

  it('should use the user token', async () => {
    sentencePlanningClient.getSentencePlanStep.mockReturnValue({})
    await service.getSentencePlanStep(token, '218', '418')

    expect(sentencePlanningClientBuilder).toBeCalledWith(token)
  })
})

describe('getSentencePlanNeeds', () => {
  it('should return an Array of needs', async () => {
    const needs = [{ id: '418', name: 'Alcohol' }, { id: '218', name: 'Alcohol' }]
    sentencePlanningClient.getSentencePlanNeeds.mockReturnValue(needs)

    const result = await service.getSentencePlanNeeds(token, '218')

    expect(result).toEqual(needs)
  })

  it('should use the user token', async () => {
    sentencePlanningClient.getSentencePlanNeeds.mockReturnValue({})
    await service.getSentencePlanNeeds(token, '218')

    expect(sentencePlanningClientBuilder).toBeCalledWith(token)
  })
})
