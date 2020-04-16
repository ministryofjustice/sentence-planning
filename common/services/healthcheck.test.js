const healthcheck = require('./healthcheck')
const { serviceCheckFactory } = require('../data/healthcheck')

jest.mock('../../build-info.json', () => {
  return { buildNumber: '1978-01-01.404', gitRef: '101' }
})
jest.mock('../data/healthcheck', () => ({
  serviceCheckFactory: jest.fn(),
}))

describe.only('service healthcheck', () => {
  const healthyCheck = { name: 'healthyCheck', config: { url: 'healthy' } }
  const unhealthyCheck = { name: 'unhealthyCheck', config: { url: 'unhealthy' } }
  let healthcheckService
  let healthcheckServiceCallback

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('with healthy dependencies', () => {
    beforeEach(done => {
      serviceCheckFactory.mockReset()
      serviceCheckFactory.mockImplementation((_name, { url }) => {
        return () => {
          return new Promise((resolve, reject) => (url === 'unhealthy' ? reject(new Error(404)) : resolve('OK')))
        }
      })
      healthcheckService = healthcheck(healthyCheck, healthyCheck, healthyCheck, healthyCheck)
      healthcheckServiceCallback = jest.fn((err, result) => {
        done()
      })
      healthcheckService(healthcheckServiceCallback)
    })
    it('should return a function', () => {
      expect(typeof healthcheckService).toBe('function')
    })
    it('should call each required service', () => {
      expect(serviceCheckFactory).toHaveBeenCalledTimes(4)
      expect(serviceCheckFactory).toHaveBeenCalledWith('healthyCheck', { url: 'healthy' })
    })
    it('should call the callback when it has completed', () => {
      expect(healthcheckServiceCallback).toHaveBeenCalled()
    })
    it('should NOT pass the callback an error', () => {
      expect(healthcheckServiceCallback.mock.calls[0][0]).toBeNull()
    })
    it('should return a JSON result object with a "health: true" parameter', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].healthy).toBe(true)
    })
    it('should return a JSON result object with a details of the checks', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].checks).toEqual({
        healthyCheck: 'OK',
      })
    })
    it('should return a JSON result object reportng uptime', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].uptime).toEqual(expect.any(Number))
    })
    it('should return a JSON result object reportng build information', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].build).toEqual({
        buildNumber: '1978-01-01.404',
        gitRef: '101',
      })
    })
    it('should return a JSON result object reportng version', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].version).toEqual(expect.any(String))
    })
  })
  describe('with unhealthy dependencies', () => {
    beforeEach(done => {
      serviceCheckFactory.mockReset()
      serviceCheckFactory.mockImplementation((_name, { url }) => {
        return () => {
          return new Promise((resolve, reject) => (url === 'unhealthy' ? reject(new Error(404)) : resolve('OK')))
        }
      })
      healthcheckService = healthcheck(healthyCheck, unhealthyCheck, healthyCheck)
      healthcheckServiceCallback = jest.fn((err, result) => {
        done()
      })
      healthcheckService(healthcheckServiceCallback)
    })
    it('should NOT pass the callback an error', () => {
      expect(healthcheckServiceCallback.mock.calls[0][0]).toBeNull()
    })
    it('should return a JSON result object with a "health: false" parameter', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].healthy).toBe(false)
    })
    it('should return a JSON result object with a details of the checks', () => {
      expect(healthcheckServiceCallback.mock.calls[0][1].checks).toEqual({
        healthyCheck: 'OK',
        unhealthyCheck: new Error(404),
      })
    })
  })
})
