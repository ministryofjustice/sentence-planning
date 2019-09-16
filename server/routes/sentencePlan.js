const express = require('express')
const flash = require('connect-flash')
const getStep = require('../middleware/getStep')
const persistStep = require('../middleware/persistStep')
const persistProgress = require('../middleware/persistProgress')
const getOffenderSummaryData = require('../middleware/getOffenderSummaryData')
const getSentencePlan = require('../middleware/getSentencePlan')
const getSentencePlanSummary = require('../middleware/getSentencePlanSummary')
const getMotivations = require('../middleware/getMotivations')
const persistMotivations = require('../middleware/persistMotivations')
const getThisIsMe = require('../middleware/getThisIsMe')
const persistThisIsMe = require('../middleware/persistThisIsMe')
const getOasysSentencePlan = require('../middleware/getOasysSentencePlan')

module.exports = (formService, offenderService, sentencePlanningService) => {
  const router = express.Router()

  const userIdPath = '/:idType(oasys-offender-id)/:id(\\d{3,})'
  const sentencePlanPath = `${userIdPath}/sentence-plan/:sentencePlanId([-0-9]+)`
  const newSentencePlanPath = `${userIdPath}/sentence-plan/:sentencePlanId(new)`
  const oasysSentencePlanPath = `${userIdPath}/oasys-sentence-plan/:oasysSentencePlanId([-0-9]+)`
  const stepPath = `${sentencePlanPath}/step/:stepId([-0-9]+)`
  const newStepPath = `${sentencePlanPath}/step/:stepId(new)`

  router.use(flash())
  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })
  router.use(userIdPath, getOffenderSummaryData(offenderService))

  router.get([`${sentencePlanPath}/this-is-me`, newSentencePlanPath], getThisIsMe())
  router.post([`${sentencePlanPath}/this-is-me`, newSentencePlanPath], persistThisIsMe(formService))
  router.get(`${sentencePlanPath}/motivations`, getMotivations())
  router.post(`${sentencePlanPath}/motivations`, persistMotivations(formService))
  router.get(`${sentencePlanPath}/summary`, getSentencePlanSummary())
  router.get(sentencePlanPath, getSentencePlan(sentencePlanningService))
  router.get(oasysSentencePlanPath, getOasysSentencePlan(sentencePlanningService))
  router.get(
    `${stepPath}/progress`,
    getStep(sentencePlanningService, '../views/formPages/stepProgress', '../views/pages/stepView')
  )
  router.post(`${stepPath}/progress`, persistProgress(formService))
  router.get(`${stepPath}/view`, getStep(sentencePlanningService, '../views/pages/stepView'))
  router.get(
    [stepPath, newStepPath],
    getStep(sentencePlanningService, '../views/formPages/step', '../views/pages/stepView')
  )
  router.post([stepPath, newStepPath], persistStep(formService))

  return router
}
