const { CORRELATION_HEADER } = require('../config/index')

module.exports = (req, res, next) => {
  req.correlationId = req.headers[CORRELATION_HEADER] || ''
  next()
}
