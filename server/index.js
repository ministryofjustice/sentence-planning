const createApp = require('./app')
const createMockAPI = require('../mockServer/app')

const elite2ClientBuilder = require('./data/elite2ClientBuilder')
const formClient = require('./data/formClient')
const createOffenderService = require('./services/offenderService')

const offenderService = createOffenderService(elite2ClientBuilder)
const createFormService = require('./services/formService')
const createSignInService = require('./authentication/signInService')

// pass in dependencies of service
const formService = createFormService(formClient)

const app = createApp({
  formService,
  offenderService,
  signInService: createSignInService(),
})

createMockAPI()

module.exports = app
