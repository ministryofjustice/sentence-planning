const superagent = require('superagent')
const logger = require('../../log')
const config = require('../config')

const timeoutSpec = {
  response: config.oasys.timeout.response,
  deadline: config.oasys.timeout.deadline,
}

const oasysapiUrl = config.oasys.url

const getIdPath = (idType, id) => {
  const path = `${idType}/${id}`
  if (/^oasysOffenderId\/\d{5}$/.test(path) || /^crn\/x\d{6}$/.test(path)) {
    return path
  }
  throw new Error(`Invalid idType: ${idType} id: ${id}`)
}

const getOffenderData = (idType, id) => {
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
  })(`${oasysapiUrl}/offenders/${getIdPath(idType, id)}`)
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
  })(`${oasysapiUrl}/offenders/${getIdPath(idType, id)}/sentencePlans/latest`)
}

module.exports = { getOffenderData, getSentencePlan }
