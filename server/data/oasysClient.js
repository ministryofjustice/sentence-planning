const superagent = require('superagent')
const logger = require('../../log')
const config = require('../config')
const getToken = require('../authentication/nomisOAuth')

const timeoutSpec = {
  response: config.oasys.timeout.response,
  deadline: config.oasys.timeout.deadline,
}

const oasysapiUrl = config.oasys.url

const getIdPath = (idType, id) => {
  const oasysIdType = idType === 'oasys-offender-id' ? 'oasysOffenderId' : idType
  const path = `${oasysIdType}/${id}`
  if (/^oasysOffenderId\/\d{3,}$/.test(path) || /^crn\/x\d{6}$/.test(path)) {
    logger.info(`Path is valid ${path}`)
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
        .auth(await getToken(), { type: 'bearer' })
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

const getOffenderNeeds = (idType, id) => {
  return (async path => {
    logger.info(`getOffenderNeeds: calling oasysapi: ${path}`)
    try {
      return await superagent
        .get(path)
        .timeout(timeoutSpec)
        .then(({ body }) => body)
    } catch (error) {
      logger.warn(`Error calling oasysapi ${error}`)
      throw error
    }
  })(`${oasysapiUrl}/offenders/${getIdPath(idType, id)}/assessments/latest/needs`)
}

module.exports = { getOffenderData, getSentencePlan, getOffenderNeeds }
