const { getObjectiveView } = require('./get.controller')

describe('getObjectiveView', () => {
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const renderInfo = { flash: 'Ah Ah, saviour of the universe' }
  const nextUrl = 'to/enlightenment/3/2/1'
  const backUrl = 'to/enlightenment/3'
  const req = { path: nextUrl, renderInfo }

  afterEach(() => {
    renderMock.mockReset()
  })

  describe('With fully populated objective data', () => {
    it('it should render the page', async () => {
      await getObjectiveView(req, res)
      const expected = { ...renderInfo, nextUrl, backUrl }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
