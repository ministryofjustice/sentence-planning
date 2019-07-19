const express = require('express')
const flash = require('connect-flash')
const getFormData = require('../middleware/getFormData')
const getStep = require('../middleware/getStep')
const persistStep = require('../middleware/persistStep')
const getOffenderSummaryData = require('../middleware/getOffenderSummaryData')
const getOffenderNeeds = require('../middleware/getOffenderNeeds')
const getSentencePlan = require('../middleware/getSentencePlan')
const getOasysSentencePlan = require('../middleware/getOasysSentencePlan')

module.exports = formService => {
  const router = express.Router()

  const userIdPath = '/:idType(oasys-offender-id)/:id(\\d{3,})'
  const sentencePlanPath = `${userIdPath}/sentence-plan/:sentencePlanId(\\d+)`
  const oasysSentencePlanPath = `${userIdPath}/oasys-sentence-plan/:oasysSentencePlanId(\\d+)`
  const stepPath = `${sentencePlanPath}/step/:stepId(\\d+)`
  const newStepPath = `${userIdPath}/sentence-plan/:sentencePlanId(new)/step/:stepId(new)`
  const newStepPath2 = `${userIdPath}/sentence-plan/:sentencePlanId(\\d+)/step/:stepId(new)`

  router.use(flash())
  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })
  router.use(userIdPath, getOffenderSummaryData())

  router.get(sentencePlanPath, getFormData(formService), getSentencePlan())
  router.get(oasysSentencePlanPath, getOasysSentencePlan())
  router.get([stepPath, newStepPath, newStepPath2], getFormData(formService), getOffenderNeeds(), getStep())
  router.post([stepPath, newStepPath, newStepPath2], getFormData(formService), persistStep(formService))

  return router
}