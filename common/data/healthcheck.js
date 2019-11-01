/* eslint-disable prefer-promise-reject-errors */
const superagent = require('superagent')
const Agent = require('agentkeepalive')
const { HttpsAgent } = require('agentkeepalive')
const logger = require('../logging/logger')

module.exports = (name, { url, agent }) => {
  const keepaliveAgent = url.startsWith('https') ? new HttpsAgent(agent) : new Agent(agent)

  return () =>
    new Promise((resolve, reject) => {
      superagent
        .get(`${url}/ping`)
        .agent(keepaliveAgent)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout({
          response: 1000,
          deadline: 1500,
        })
        .end((error, result) => {
          logger.info(`${name} ${url}/ping ${result}`)
          if (error) {
            logger.error(error.stack, `Error calling ${name}`)
            reject(error)
          } else if (result.status === 200) {
            resolve('OK')
          } else {
            reject(result.status)
          }
        })
    })
}
