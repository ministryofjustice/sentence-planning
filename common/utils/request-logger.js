const logger = require('../logging/logger')

const logRequestStart = context => {
  logger.debug(`Calling ${context.service}  ${context.description}-`, {
    service: context.service,
    method: context.method,
    url: context.url,
  })
}
const logRequestEnd = context => {
  const duration = new Date() - context.startTime
  logger.info(`[${context.correlationId}] - ${context.method} to ${context.url} ended - elapsed time: ${duration} ms`)
}
const logRequestFailure = (context, response) => {
  logger.error(`[${context.correlationId}] Calling ${context.service} to ${context.description} failed -`, {
    service: context.service,
    method: context.method,
    url: context.url,
    status: response.statusCode,
  })
}
const logRequestError = (context, error) => {
  logger.error(`[${context.correlationId}] Calling ${context.service} to ${context.description} threw exception -`, {
    service: context.service,
    method: context.method,
    url: context.url,
    error,
  })
}

export { logRequestStart, logRequestEnd, logRequestFailure, logRequestError }
