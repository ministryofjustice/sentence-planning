// Node.js core dependencies
const { join } = require('path')

// Npm dependencies
const express = require('express')
const favicon = require('serve-favicon')
const { json, urlencoded } = require('body-parser')
const loggingMiddleware = require('morgan')
const compression = require('compression')
const { configure } = require('nunjucks')
const cookieSession = require('cookie-session')

// Local dependencies
const argv = require('minimist')(process.argv.slice(2))
const staticify = require('staticify')(join(__dirname, 'public'))
const logger = require('./common/logging/logger')
const router = require('./app/router')
const noCache = require('./common/utils/no-cache')
const correlationHeader = require('./common/middleware/correlation-header')
const { saveKeycloakHeaders: keycloakHeader, keycloakHeaders } = require('./common/middleware/save-keycloak-headers')
const addUserInformation = require('./common/middleware/add-user-information')
const { mdcSetup } = require('./common/logging/logger-mdc')
const { createMockAPI } = require('./mockServer/app')

// Global constants
const { static: _static } = express
const unconfiguredApp = express()
const oneYear = 86400000 * 365
const publicCaching = { maxAge: oneYear }
const PORT = process.env.PORT || 3000
const { NODE_ENV } = process.env
const CSS_PATH = staticify.getVersionedPath('/stylesheets/application.min.css')
const JAVASCRIPT_PATH = staticify.getVersionedPath('/javascripts/application.js')
const allGateKeeperPages = /^\/(?!health$).*/

// Define app views
const APP_VIEWS = [
  join(__dirname, 'node_modules/govuk-frontend/'),
  join(__dirname, 'node_modules/@ministryofjustice/frontend/'),
  __dirname,
]

function initialiseGlobalMiddleware(app) {
  app.set('settings', { getVersionedPath: staticify.getVersionedPath })
  app.use(favicon(join(__dirname, 'public/images/', 'favicon.ico')))
  app.use(compression())
  app.use(staticify.middleware)

  if (process.env.DISABLE_REQUEST_LOGGING !== 'true') {
    app.use(
      /\/((?!images|public|stylesheets|javascripts).)*/,
      loggingMiddleware(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - total time :response-time ms'
      )
    )
  }

  app.use((req, res, next) => {
    res.locals.asset_path = '/public/' // eslint-disable-line camelcase
    noCache(res)
    next()
  })
  app.use(json())
  app.use(urlencoded({ extended: true }))

  app.use(
    cookieSession({
      name: 'session',
      keys: ['key1', 'key2'],

      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  )

  if (process.env.NODE_ENV === 'local') {
    app.use(allGateKeeperPages, (req, res, next) => {
      keycloakHeaders.forEach(headerName => {
        logger.info(`Running locally: setting default header ${headerName}.`)
        req.headers[headerName] = `Test ${headerName}`
      })
      next()
    })
    createMockAPI()
  }

  app.use(allGateKeeperPages, correlationHeader)
  app.use(allGateKeeperPages, keycloakHeader)
  app.use(allGateKeeperPages, addUserInformation)

  // must be after session since we need session
  app.use(mdcSetup)
}

function initialiseProxy(app) {
  app.enable('trust proxy')
}

function initialiseTemplateEngine(app) {
  // Configure nunjucks
  // see https://mozilla.github.io/nunjucks/api.html#configure
  const nunjucksConfiguration = {
    express: app, // The express app that nunjucks should install to
    autoescape: true, // Controls if output with dangerous characters are escaped automatically
    throwOnUndefined: false, // Throw errors when outputting a null/undefined value
    trimBlocks: true, // Automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // Automatically remove leading whitespace from a block/tag
    watch: NODE_ENV !== 'production', // Reload templates when they are changed (server-side). To use watch, make sure optional dependency chokidar is installed
    noCache: NODE_ENV !== 'production', // Never use a cache and recompile templates each time (server-side)
  }

  // Initialise nunjucks environment
  const nunjucksEnvironment = configure(APP_VIEWS, nunjucksConfiguration)

  // Set view engine
  app.set('view engine', 'njk')

  // Version static assets on production for better caching
  // if it's not production we want to re-evaluate the assets on each file change
  nunjucksEnvironment.addGlobal(
    'css_path',
    NODE_ENV === 'production' ? CSS_PATH : staticify.getVersionedPath('/stylesheets/application.min.css')
  )
  nunjucksEnvironment.addGlobal(
    'js_path',
    NODE_ENV === 'production' ? JAVASCRIPT_PATH : staticify.getVersionedPath('/javascripts/application.js')
  )
}

function initialisePublic(app) {
  app.use('/javascripts', _static(join(__dirname, '/public/assets/javascripts'), publicCaching))
  app.use('/images', _static(join(__dirname, '/public/images'), publicCaching))
  app.use('/stylesheets', _static(join(__dirname, '/public/assets/stylesheets'), publicCaching))
  app.use('/public', _static(join(__dirname, '/public')))
  app.use('/', _static(join(__dirname, '/node_modules/govuk-frontend/')))
}

function initialiseRoutes(app) {
  router(app)
}

function listen() {
  const app = initialise()
  app.listen(PORT)
  logger.info(`Listening on port ${PORT}`)
}

/**
 * Configures app
 * @return app
 */
function initialise() {
  const app = unconfiguredApp
  app.disable('x-powered-by')
  initialiseProxy(app)
  initialiseGlobalMiddleware(app)
  initialiseTemplateEngine(app)
  initialiseRoutes(app)
  initialisePublic(app)
  return app
}

/**
 * Starts app after ensuring DB is up
 */
function start() {
  listen()
}

/**
 * -i flag. Immediately invoke start.
 * Allows script to be run by task runner
 */
if (argv.i) {
  start()
}

module.exports = { start, getApp: initialise, staticify }
