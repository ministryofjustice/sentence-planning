const express = require('express')
const asyncMiddleware = require('../middleware/asyncMiddleware')

module.exports = () => {
  const router = express.Router()

  router.get(
    '/:idType(oasys-offender-id)/:id(\\d{5})',
    asyncMiddleware(async (req, res) => {
      const {
        params: { id },
      } = req
      res.render('../views/formPages/sentencePlan', { oasysOffenderId: id })
    })
  )

  return router
}
