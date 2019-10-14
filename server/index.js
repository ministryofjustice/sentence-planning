const createApp = require('./app')
const createMockAPI = require('../mockServer/app')

const elite2ClientBuilder = require('./data/elite2ClientBuilder')
const sentencePlanningClientBuilder = require('./data/sentencePlanningClientBuilder')
const createOffenderService = require('./services/offenderService')
const createSentencePlanningService = require('./services/sentencePlanningService')

const offenderService = createOffenderService(elite2ClientBuilder)
const sentencePlanningService = createSentencePlanningService(sentencePlanningClientBuilder)

const logger = require('../log')

// pass in dependencies of service

const app = createApp({
  offenderService,
  sentencePlanningService,
})

logger.info(`### process.env.NODE_ENV ::: ${process.env.NODE_ENV}`)
if (process.env.NODE_ENV !== 'production') {
  createMockAPI()
}

module.exports = app
