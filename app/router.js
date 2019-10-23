// Local dependencies
const { router: healthcheckRouter } = require('./healthcheck/index')
const { router } = require('./index')

// Export
module.exports = app => {
  app.use(healthcheckRouter)
  app.use(router)
}
