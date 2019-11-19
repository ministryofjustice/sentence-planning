// Local dependencies
const healthCheckFactory = require('../common/services/healthcheck')
const getOffenderDetails = require('../common/middleware/getOffenderDetails')
const {
  apis: { oauth2, oasys, sentencePlanning, elite2 },
} = require('../common/config')

const offenderRoot = '/individual-id/:id(\\d{1,})'

// pages
const { sentencePlanSummary } = require('./plans/get.controller')

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
  app.use(offenderRoot, getOffenderDetails)
  app.get(offenderRoot, (req, res) => res.redirect(`/individual-id/${req.params.id}/plans`))
  app.get(`${offenderRoot}/plans`, (req, res) => sentencePlanSummary(req, res))
}
