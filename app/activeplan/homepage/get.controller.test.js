const controller = require('./get.controller')

describe('showHomepage', () => {
  const req = {
    params: {
      planId: 12,
      id: 123,
    },
    session: {
      'x-auth-token': '1234',
      planStarted: false,
    },
  }
  const res = {
    render: jest.fn(),
  }

  afterEach(() => {
    req.session.planStarted = false
  })

  it('should pass in the correct values to the render function', async () => {
    const expected = {
      planId: 12,
      id: 123,
      planStarted: false,
    }
    await controller.getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
  it('should pass in the correct values to the render function when plan has just been started', async () => {
    req.session.planStarted = true
    const expected = {
      planId: 12,
      id: 123,
      planStarted: true,
    }
    await controller.getHomepage(req, res)
    expect(req.session.planStarted).toEqual(undefined)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })
})