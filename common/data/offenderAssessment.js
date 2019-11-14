const superagent = require('superagent')
const logger = require('../logging/logger')
const getToken = require('./nomisOAuth')
const {
  apis: {
    offenderAssessment: { timeout, url },
  },
} = require('../config')

const oasysapiUrl = `${url}/offenders/oasysOffenderId/`

const getOffenderData = async id => {
  const path = `${oasysapiUrl}${id}`
  logger.info(`getOffenderData: calling oasysapi: ${path}`)
  try {
    return await superagent
      .get(path)
      .auth(await getToken(), { type: 'bearer' })
      .timeout(timeout)
      .then(({ body }) => body)
  } catch (error) {
    logger.warn('Error calling offender-assessment')
    logger.warn(error)
    throw error
  }
}

module.exports = { getOffenderData }
