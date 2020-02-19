// Local dependencies
const { createSentencePlan } = require('../data/sentencePlanningApi')
const createSentencePlanMiddleware = require('./createSentencePlan')

jest.mock('../data/sentencePlanningApi', () => ({
  createSentencePlan: jest.fn(() => ({ id: 52 })),
}))

describe('Create a sentence plan.', () => {
  let req
  let res
  const tokens = { authorisationToken: 'mytoken' }
  const redirectMock = jest.fn()
  const renderMock = jest.fn()
  beforeEach(() => {
    req = {
      params: { id: 1 },
      tokens,
      originalUrl: 'fakeUrl/new',
    }
    res = {
      redirect: redirectMock,
      render: renderMock,
    }
  })
  afterEach(() => {
    createSentencePlan.mockReset()
    redirectMock.mockReset()
    renderMock.mockReset()
  })

  test("should redirect to the new id's sentence plan page", async () => {
    await createSentencePlanMiddleware(req, res)
    expect(renderMock).not.toBeCalled()
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('fakeUrl/52')
  })

  test('should render an error if the response is an empty object', async () => {
    beforeEach(() => {
      createSentencePlan.mockImplementation((_offenderId, _token) => ({}))
    })
    await createSentencePlanMiddleware(req, res)
    expect(redirectMock).not.toBeCalled()
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock.mock.calls[0][0]).toBe('app/error')
  })

  test('should render the error page if an error is thrown', async () => {
    const mockError = new Error(404)
    beforeEach(() => {
      createSentencePlan.mockImplementation((_offenderId, _token) => {
        throw mockError
      })
    })
    await createSentencePlanMiddleware(req, res)
    expect(redirectMock).not.toBeCalled()
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock.mock.calls[0][0]).toBe('app/error')
  })
})
