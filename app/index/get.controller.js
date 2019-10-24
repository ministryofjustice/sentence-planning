const logger = require('../../common/logging/logger')

module.exports = (req, res) => {
  logger.info('Testing logging')
  const params = {
    message: `Hello, world!`,
  }
  res.render('app/index/index', params)
}
