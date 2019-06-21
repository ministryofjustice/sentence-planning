const express = require('express')
const { offenderSummaryData } = require('../services/offenderSummaryService')
const { getTimeStringFromISO8601 } = require('../../server/utils/displayHelpers')

const getOasysOffenderId = (req, res, next) => {
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

module.exports = () => {
  const router = express.Router()

  const userIdPath = '/:idType(oasys-offender-id)/:id(\\d{3,})'
  const sentencePlanPath = `${userIdPath}/sentence-plan-id/:sentencePlanId(\\d+)`
  const actionPath = `${sentencePlanPath}/action-id/:actionId(\\d+)`

  router.get(sentencePlanPath, getOasysOffenderId, (req, res) => {
    const {
      params: { sentencePlanId },
    } = req
    res.locals.sentencePlanId = sentencePlanId
    res.render('../views/pages/sentencePlan', res.locals)
  })
  router.get(actionPath, getOasysOffenderId, (req, res) => {
    const {
      params: { sentencePlanId },
    } = req
    res.locals.sentencePlanId = sentencePlanId
    res.render('../views/formPages/action', res.locals)
  })

  return router
}
