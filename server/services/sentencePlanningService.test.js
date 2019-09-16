const serviceCreator = require('./sentencePlanningService')

const token = 'token-1'

const sentencePlanningClient = {
  getSentencePlans: jest.fn(),
  getSentencePlan: jest.fn(),
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
