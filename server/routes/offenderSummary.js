const express = require('express')
const getSentencePlans = require('../middleware/getSentencePlans')
const getOffenderSummaryData = require('../middleware/getOffenderSummaryData')
const getOffenderSummary = require('../middleware/getOffenderSummary')

module.exports = sentencePlanService => {
  const router = express.Router()

  router.get(
    ['/:idType(oasys-offender-id)/:id(\\d{3,})', '/:idType(crn)/:id(x\\d{6})'],
    getOffenderSummaryData(),
    getSentencePlans(sentencePlanService),
    getOffenderSummary()
  )

  return router
}
