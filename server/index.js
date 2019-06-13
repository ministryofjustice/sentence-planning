const createApp = require('./app')
const createMockAPI = require('../mockServer/app')

const formClient = require('./data/formClient')

const createFormService = require('./services/formService')
const createSignInService = require('./authentication/signInService')

// pass in dependencies of service
const formService = createFormService(formClient)

const app = createApp({
  formService,
  signInService: createSignInService(),
})

createMockAPI()

module.exports = app
