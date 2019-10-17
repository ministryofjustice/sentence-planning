const express = require('express')
const path = require('path')
const logger = require('../../log')
const getToken = require('../authentication/nomisOAuth')

module.exports = function Index({ offenderService }) {
  const router = express.Router()

  const placeHolder = path.join(__dirname, '../../assets/images/image-missing.png')

  router.get('/offender/:bookingId/image', async (req, res) => {
    const { bookingId } = req.params
    const token = await getToken()
    offenderService
      .getOffenderImage(token, bookingId)
      .then(data => {
        res.type('image/jpeg')
        data.pipe(res)
      })
      .catch(error => {
        logger.error(`Could not retrieve '${req.originalUrl}' with booking id '${bookingId}' - ${error}`)
        res.sendFile(placeHolder)
      })
  })

  return router
}
