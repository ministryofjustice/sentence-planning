const express = require('express')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const { offenderSummaryData } = require('../services/offenderSummaryService')

module.exports = () => {
  const router = express.Router()

  const offenderSummaryCallback = asyncMiddleware(async (req, res) => {
    const {
      params: { idType, id },
    } = req
    offenderSummaryData(idType, id, (err, summaryData = {}) => {
      if (err) return res.render('pages/unknownRecord', { id, idType })
      return res.render('pages/offenderSummary', summaryData)
    })
  })

  router.get('/:idType(oasys-offender-id)/:id(\\d{5})', offenderSummaryCallback)
  router.get('/:idType(crn)/:id(x\\d{6})', offenderSummaryCallback)

  return router
}
