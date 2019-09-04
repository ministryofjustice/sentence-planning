const express = require('express')
const path = require('path')
const logger = require('../../log')

module.exports = function Index({ authenticationMiddleware, offenderService }) {
  const router = express.Router()

  router.use(authenticationMiddleware())

  const placeHolder = path.join(__dirname, '../../assets/images/image-missing.png')

  router.get('/offender/:bookingId/image', (req, res) => {
    const { bookingId } = req.params
    offenderService
      .getOffenderImage(res.locals.user.token, bookingId)
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
