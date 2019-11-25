const { readFile } = require('fs')
const express = require('express')

const app = express()
const logger = require('../common/logging/logger')

const getFile = (directory, file, res) => {
  const path = `mockServer/${directory}/${file}.json`
  logger.debug(`apiMockServer requesting ${path}`)
  readFile(path, (err, sentencePlan) => {
    return err ? res.status(404).send(`Invalid path ${path}`) : res.send(JSON.parse(sentencePlan))
  })
}

function createMockAPI() {
  app.use('*', (req, res, next) => {
    logger.info(`MockAPI recieved for ${req.originalUrl}`)
    next()
  })
  app.use(express.json())
  app.get('/', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    return getFile('convictData', req.params[1], res)
  })
  app.get('/offenders/:individualid/sentenceplans', (req, res) => {
    return getFile('sentencePlanSummary', req.params.offenderId, res)
  })
  app.post('/sentenceplan', (req, res) => {
    logger.info(`%%%%%%% ${JSON.stringify(req.body)}`)
    logger.info(`%%%%%%% ${req.body.offenderId}`)
    return getFile('sentencePlan', req.body.offenderId, res)
  })
  app.listen(18081)
}
module.exports = { createMockAPI }
