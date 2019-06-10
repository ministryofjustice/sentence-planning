const superagent = require('superagent')
const logger = require('../../log')
const config = require('../config')

const timeoutSpec = {
  response: config.oasys.timeout.response,
  deadline: config.oasys.timeout.deadline,
}

const oasysapiUrl = config.oasys.url

const getOffenderData = crn => {
  return (async path => {
    logger.info(`getOffenderData: calling oasysapi: ${path}`)
    try {
      return await superagent
        .get(path)
        .timeout(timeoutSpec)
        .then(({ body }) => body)
    } catch (error) {
      logger.warn('Error calling oasysapi')
      logger.warn(error)
      throw error
    }
  })(`${oasysapiUrl}/offenders/crn/${crn}`)
}

const getSentencePlan = (idType, id) => {
  return (async path => {
    logger.info(`getSentencePlan: calling oasysapi: ${path}`)
    try {
      return await superagent
        .get(path)
        .timeout(timeoutSpec)
        .then(({ body }) => body)
    } catch (error) {
      logger.warn('Error calling oasysapi')
      logger.warn(error)
      throw error
    }
  })(`${oasysapiUrl}/offenders/${idType}/${id}/sentencePlans/latest`)
}

module.exports = { getOffenderData, getSentencePlan }
