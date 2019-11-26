// Local dependencies
const healthCheckFactory = require('../common/services/healthcheck')
const getOffenderDetails = require('../common/middleware/getOffenderDetails')
const {
  apis: { oauth2, offenderAssessment, sentencePlanning, elite2 },
} = require('../common/config')

const numericId = '\\d{1,}'
const offenderRoute = `/individual-id/:id(${numericId})`
const editPlanRoute = `${offenderRoute}/edit-plan/:planId(${numericId})`

const { validate } = require('../common/middleware/validator')

// pages
const { sentencePlanSummary } = require('./plans/get.controller')

const { getDiversity } = require('./diversity/get.controller')
const { postDiversity, diversityValidationRules } = require('./diversity/post.controller')

const { getNeedToKnow } = require('./needToKnow/get.controller')
const { postNeedToKnow, needToKnowValidationRules } = require('./needToKnow/post.controller')

const createSentencePlan = require('../common/middleware/createSentencePlan')
const { editPlan } = require('./editPlan/get.controller')

// Export
module.exports = app => {
  app.get('/health', (req, res, next) => {
    const healthService = healthCheckFactory(oauth2, offenderAssessment, sentencePlanning, elite2)
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

  app.use(offenderRoute, getOffenderDetails)
  app.get(`${offenderRoute}/plans`, (req, res) => sentencePlanSummary(req, res))

  // sentence plans summary
  app.get([offenderRoute, `${offenderRoute}/plans`], sentencePlanSummary)

  // diversity
  app.get([`${offenderRoute}/edit-plan/:planid(\\d{1,})/diversity`], getDiversity)
  app.post(
    [`${offenderRoute}/edit-plan/:planid(\\d{1,})/diversity`],
    diversityValidationRules(),
    validate,
    postDiversity
  )

  // need to know
  app.get([`${offenderRoute}/edit-plan/:planid(\\d{1,})/need-to-know`], getNeedToKnow)
  app.post(
    [`${offenderRoute}/edit-plan/:planid(\\d{1,})/need-to-know`],
    needToKnowValidationRules(),
    validate,
    postNeedToKnow
  )

  app.use(offenderRoute, getOffenderDetails)
  app.get([offenderRoute, `${offenderRoute}/plans`], sentencePlanSummary)
  app.get(`${offenderRoute}/edit-plan/new`, createSentencePlan)
  app.get(editPlanRoute, editPlan)

  app.get('*', (req, res) => res.render('app/error', { error: '404, Page Not Found' }))
}
