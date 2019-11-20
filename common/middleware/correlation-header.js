const { correlationHeader } = require('../config')

module.exports = (req, res, next) => {
  req.correlationId = req.headers[correlationHeader] || ''
  next()
}
