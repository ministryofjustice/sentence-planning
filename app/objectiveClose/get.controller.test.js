const { getCloseObjective } = require('./get.controller')

describe('getObjectiveReview', () => {
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const renderInfo = { bang: 'And the dirt is gone' }
  const path = 'of/least/resistance/2/1'
  const backUrl = 'of/least/resistance'
  const errors = {}
  const errorSummary = {}
  const req = { path, renderInfo, errors, errorSummary }

  afterEach(() => {
    renderMock.mockReset()
  })

  describe('display the page', () => {
    test('it should render the page', async () => {
      await getCloseObjective(req, res)
      const expected = { ...renderInfo, backUrl, body: {}, errorSummary, errors }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
