const express = require('express')
const flash = require('connect-flash')
const getFormData = require('../middleware/getFormData')
const getStep = require('../middleware/getStep')
const persistStep = require('../middleware/persistStep')
const getOffenderSummaryData = require('../middleware/getOffenderSummaryData')
const getOffenderNeeds = require('../middleware/getOffenderNeeds')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const logger = require('../../log')

const getSentencePlanSteps = (oasysOffenderId, sentencePlanId, sentencePlans) => {
  const linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
  return sentencePlans
    .find(({ sentencePlanId: id }) => {
      return id === sentencePlanId
    })
    .steps.map(({ step = '', intervention = '', stepId, dateCreated }) => {
      return {
        key: {
          text: step || intervention,
        },
        value: {
          text: getTimeStringFromISO8601(dateCreated),
        },
        actions: {
          items: [
            {
              href: `${linkRoot}${stepId}`,
              text: 'Change',
              visuallyHiddenText: `Action ${stepId}`,
            },
          ],
        },
      }
    })
}

module.exports = formService => {
  const router = express.Router()

  const userIdPath = '/:idType(oasys-offender-id)/:id(\\d{3,})'
  const sentencePlanPath = `${userIdPath}/sentence-plan/:sentencePlanId(\\d+)`
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
  router.use(userIdPath, getOffenderSummaryData)

  router.get(sentencePlanPath, getFormData(formService), (req, res) => {
    const {
      params: { id: oasysOffenderId, sentencePlanId },
    } = req
    try {
      const { locals } = res
      locals.steps = getSentencePlanSteps(oasysOffenderId, sentencePlanId, locals.formObject.sentencePlans)
      locals.sentencePlanId = sentencePlanId
      return res.render('../views/pages/sentencePlan', locals)
    } catch (err) {
      logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
      return res.redirect('/')
    }
  })
  router.get([stepPath, newStepPath, newStepPath2], getFormData(formService), getOffenderNeeds(), getStep())
  router.post([stepPath, newStepPath, newStepPath2], getFormData(formService), persistStep(formService))

  return router
}
