const { getActionReorder } = require('./get.controller')

describe('getActionReorder', () => {
  const renderMock = jest.fn()
  const res = {
    render: renderMock,
  }
  const renderInfo = { flash: 'Ah Ah, saviour of the universe' }
  const path = 'to/enlightenment/3/2/1'
  const backUrl = 'to/enlightenment/3/2'
  const req = { path, renderInfo }

  afterEach(() => {
    renderMock.mockReset()
  })

  describe('With fully populated objective data', () => {
    it('it should render the page', async () => {
      await getActionReorder(req, res)
      const expected = { ...renderInfo, backUrl }
      expect(renderMock).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
  })
})
