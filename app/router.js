// Local dependencies
const healthCheckFactory = require('../common/services/healthcheck')
const {
  apis: { oauth2, oasys, sentencePlanning, elite2 },
} = require('../common/config')
const { router } = require('./index')

// Export
module.exports = app => {
  app.get('/health', (req, res, next) => {
    const healthService = healthCheckFactory(oauth2, oasys, sentencePlanning, elite2)
    healthService((err, result) => {
      if (err) {
        return next(err)
      }
      if (!result.healthy) {
        res.status(503)
      }
      res.json(result)
      return result
    })
  })
  app.use(router)
}
