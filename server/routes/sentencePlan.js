const express = require('express')
const flash = require('connect-flash')
const { isNilOrEmpty, getFieldName, pickBy } = require('../utils/functionalHelpers')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const getFormData = require('../middleware/getFormData')
const { offenderSummaryData } = require('../services/offenderSummaryService')
const { offenderNeeds } = require('../services/offenderNeedsService')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { action: actionFormConfig } = require('../config/action')
const logger = require('../../log')

const processFormData = (req, res, next) => {
  const {
    params: { sentencePlanId, actionId },
  } = req
  try {
    res.locals.formObject =
      res.locals.formObject.sentencePlans
        .find(({ sentencePlanId: id }) => {
          return id === sentencePlanId
        })
        .actions.find(({ actionId: id }) => {
          return id === actionId
        }) || {}
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId} and action: ${actionId}`)
    res.locals.formObject = {}
  }

  return next()
}
const getSentencePlanActions = (req, res, next) => {
  const {
    params: { oasysOffenderId, sentencePlanId },
  } = req
  try {
    const linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan-id/${sentencePlanId}/action-id/`
    res.locals.actions = res.locals.formObject.sentencePlans
      .find(({ sentencePlanId: id }) => {
        return id === sentencePlanId
      })
      .actions.map(({ actionId, dateCreated }) => {
        return [
          {
            text: actionId,
          },
          {
            text: getTimeStringFromISO8601(dateCreated),
          },
          {
            text: 'edit',
            href: `${linkRoot}${actionId}`,
          },
        ]
      })
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    res.locals.actions = []
  }
  res.locals.nextActionId = res.locals.actions.length + 1
  return next()
}
const getOffenderSummaryData = (req, res, next) => {
  const {
    params: { idType, id: oasysOffenderId },
  } = req
  offenderSummaryData(idType, oasysOffenderId, (err, summaryData = {}) => {
    if (err) return res.render('../views/pages/unknownRecord', { oasysOffenderId, idType })
    const {
      forename1,
      forename2 = '',
      familyName,
      dateOfBirth,
      identifiers: { crn = '', nomisId = '' },
    } = summaryData
    res.locals = {
      ...res.locals,
      oasysOffenderId,
      forename1,
      forename2,
      familyName,
      crn,
      nomisId,
      dateOfBirth: getTimeStringFromISO8601(dateOfBirth),
    }
    return next()
  })
}

const getOffenderNeeds = (req, res, next) => {
  const {
    params: { idType, id: oasysOffenderId },
  } = req
  offenderNeeds(idType, oasysOffenderId, (err, needs = {}) => {
    if (err) return res.render('../views/pages/unknownRecord', { oasysOffenderId, idType })
    const checkedNeeds = res.locals.formObject.needs || []
    res.locals.needs = needs
      .sort(({ riskOfHarm }) => {
        return riskOfHarm ? 1 : -1
      })
      .map(({ name, riskOfHarm }) => {
        return {
          text: name,
          value: name,
          checked: checkedNeeds.includes(name),
          hint: { text: riskOfHarm ? '' : ' Risk of serious harm' },
        }
      })
    return next()
  })
}

module.exports = formService => {
  const router = express.Router()

  const userIdPath = '/:idType(oasys-offender-id)/:id(\\d{3,})'
  const sentencePlanPath = `${userIdPath}/sentence-plan-id/:sentencePlanId(\\d+)`
  const actionPath = `${sentencePlanPath}/action-id/:actionId(\\d+)`

  router.use(flash())
  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })

  router.get(sentencePlanPath, getOffenderSummaryData, getFormData(formService), getSentencePlanActions, (req, res) => {
    const {
      params: { sentencePlanId },
    } = req
    res.locals.sentencePlanId = sentencePlanId
    res.render('../views/pages/sentencePlan', res.locals)
  })
  router.get(
    actionPath,
    getFormData(formService),
    getOffenderSummaryData,
    processFormData,
    getOffenderNeeds,
    asyncMiddleware(async (req, res) => {
      const {
        params: { sentencePlanId, actionId },
      } = req
      res.locals.actionId = actionId
      res.locals.sentencePlanId = sentencePlanId
      res.render('../views/formPages/action', res.locals)
    })
  )
  router.post(
    actionPath,
    getFormData(formService),
    asyncMiddleware(async (req, res) => {
      const {
        params: { id, sentencePlanId, actionId },
      } = req
      logger.debug(`£££ ${req.originalUrl}`)
      if (!Array.isArray(req.body.needs)) req.body.needs = [req.body.needs]
      const expectedFields = actionFormConfig.fields.map(getFieldName)
      const inputForExpectedFields = pickBy((val, key) => expectedFields.includes(key), req.body)
      if (actionFormConfig.validate) {
        const formResponse = inputForExpectedFields
        const errors = formService.getValidationErrors(formResponse, actionFormConfig)

        if (!isNilOrEmpty(errors)) {
          req.flash('errors', errors)
          req.flash('userInput', inputForExpectedFields)
          return res.redirect(req.header('Referer') || req.originalUrl)
        }
      }
      const currentTimeIsoString = new Date().toISOString()
      inputForExpectedFields.dateCreated = res.locals.formObject.dateCreated || currentTimeIsoString
      inputForExpectedFields.dateUpdated = currentTimeIsoString

      await formService.updateAction({
        oaSysId: req.params.id,
        existingData: res.locals.formObject,
        sentencePlanId,
        actionId,
        newData: inputForExpectedFields,
        formId: res.locals.formId,
      })

      return res.redirect(`/sentence-plan/oasys-offender-id/${id}/sentence-plan-id/${sentencePlanId}/`)
    })
  )

  return router
}
