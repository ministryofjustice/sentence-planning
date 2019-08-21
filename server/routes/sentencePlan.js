const express = require('express')
const flash = require('connect-flash')
const getFormData = require('../middleware/getFormData')
const getStep = require('../middleware/getStep')
const persistStep = require('../middleware/persistStep')
const persistProgress = require('../middleware/persistProgress')
const getOffenderSummaryData = require('../middleware/getOffenderSummaryData')
const getOffenderNeeds = require('../middleware/getOffenderNeeds')
const getSentencePlan = require('../middleware/getSentencePlan')
const getSentencePlanSummary = require('../middleware/getSentencePlanSummary')
const getMotivations = require('../middleware/getMotivations')
const persistMotivations = require('../middleware/persistMotivations')
const getThisIsMe = require('../middleware/getThisIsMe')
const persistThisIsMe = require('../middleware/persistThisIsMe')
const getOasysSentencePlan = require('../middleware/getOasysSentencePlan')

module.exports = formService => {
  const router = express.Router()

  const userIdPath = '/:idType(oasys-offender-id)/:id(\\d{3,})'
  const sentencePlanPath = `${userIdPath}/sentence-plan/:sentencePlanId(\\d+)`
  const newSentencePlanPath = `${userIdPath}/sentence-plan/:sentencePlanId(new)`
  const oasysSentencePlanPath = `${userIdPath}/oasys-sentence-plan/:oasysSentencePlanId(\\d+)`
  const stepPath = `${sentencePlanPath}/step/:stepId(\\d+)`
  const newStepPath = `${sentencePlanPath}/step/:stepId(new)`

  router.use(flash())
  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })
  router.use(userIdPath, getOffenderSummaryData())

  router.get([`${sentencePlanPath}/this-is-me`, newSentencePlanPath], getFormData(formService), getThisIsMe())
  router.post(
    [`${sentencePlanPath}/this-is-me`, newSentencePlanPath],
    getFormData(formService),
    persistThisIsMe(formService)
  )
  router.get(`${sentencePlanPath}/motivations`, getFormData(formService), getOffenderNeeds(), getMotivations())
  router.post(
    `${sentencePlanPath}/motivations`,
    getFormData(formService),
    getOffenderNeeds(),
    persistMotivations(formService)
  )
  router.get(`${sentencePlanPath}/summary`, getFormData(formService), getOffenderNeeds(), getSentencePlanSummary())
  router.get(sentencePlanPath, getFormData(formService), getSentencePlan())
  router.get(oasysSentencePlanPath, getOasysSentencePlan())
  router.get(
    `${stepPath}/progress`,
    getFormData(formService),
    getOffenderNeeds(),
    getStep('../views/formPages/stepProgress')
  )
  router.post(`${stepPath}/progress`, getFormData(formService), persistProgress(formService))
  router.get(`${stepPath}/view`, getFormData(formService), getOffenderNeeds(), getStep('../views/pages/stepView'))
  router.get([stepPath, newStepPath], getFormData(formService), getOffenderNeeds(), getStep('../views/formPages/step'))
  router.post([stepPath, newStepPath], getFormData(formService), persistStep(formService))

  return router
}
