const createApp = require('./app')
const createMockAPI = require('../mockServer/app')

const elite2ClientBuilder = require('./data/elite2ClientBuilder')
const sentencePlanningClientBuilder = require('./data/sentencePlanningClientBuilder')
const formClient = require('./data/formClient')
const createOffenderService = require('./services/offenderService')
const createSentencePlanningService = require('./services/sentencePlanningService')

const offenderService = createOffenderService(elite2ClientBuilder)
const sentencePlanningService = createSentencePlanningService(sentencePlanningClientBuilder)
const createFormService = require('./services/formService')
const createSignInService = require('./authentication/signInService')

// pass in dependencies of service
const formService = createFormService(formClient)

const app = createApp({
  formService,
  offenderService,
  sentencePlanningService,
  signInService: createSignInService(),
})

createMockAPI()

module.exports = app
