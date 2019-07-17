const express = require('express')
const getFormData = require('../middleware/getFormData')
const getOffenderSummaryData = require('../middleware/getOffenderSummaryData')
const getOffenderSummary = require('../middleware/getOffenderSummary')

module.exports = formService => {
  const router = express.Router()

  router.get(
    ['/:idType(oasys-offender-id)/:id(\\d{3,})', '/:idType(crn)/:id(x\\d{6})'],
    getOffenderSummaryData(),
    getFormData(formService),
    getOffenderSummary()
  )

  return router
}
