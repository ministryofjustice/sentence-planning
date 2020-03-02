const { getObjectiveReview } = require('./get.controller')

describe('getObjectiveReview', () => {
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const renderInfo = { flash: 'Ah Ah, saviour of the universe' }
  const path = 'to/enlightenment/3/2/1'
  const nextUrl = 'to/enlightenment/3/2'
  const backUrl = 'to/enlightenment'
  const req = { path, renderInfo }

  afterEach(() => {
    renderMock.mockReset()
  })

  describe('With fully populated objective data', () => {
    it('it should render the page', async () => {
      await getObjectiveReview(req, res)
      const expected = { ...renderInfo, nextUrl, backUrl }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
