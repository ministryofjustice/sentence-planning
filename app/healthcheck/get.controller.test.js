// NPM dependencies
const supertest = require('supertest');

// Local dependencies
const { getApp } = require('../../server')

describe('GET /healthcheck endpoint', () => {
  let app
  beforeEach(() => {
    app = getApp()
  })
  // afterEach(done => {
  //   app.close(done)
  // })
  test('should return HTTP 200 status with expected JSON', done => {
    supertest(app)
      .get('/healthcheck')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        const response = JSON.parse(res.text)
        expect(response.ping.healthy).toBe(true)
      })
      .end(done)
  })
})
