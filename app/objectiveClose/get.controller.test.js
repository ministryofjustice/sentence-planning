const { getCloseObjective } = require('./get.controller')

describe('getObjectiveReview', () => {
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const renderInfo = { bang: 'And the dirt is gone' }
  const path = 'to/enlightenment/3/2/1'
  const backUrl = 'to/enlightenment/3'
  const errors = {}
  const errorSummary = {}
  const req = { path, renderInfo, errors, errorSummary }

  afterEach(() => {
    renderMock.mockReset()
  })

  describe('With fully populated objective data', () => {
    it('it should render the page', async () => {
      await getCloseObjective(req, res)
      const expected = { ...renderInfo, backUrl, body: {}, errorSummary, errors }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
