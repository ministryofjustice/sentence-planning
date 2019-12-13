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
    logger.info(`MockAPI received for ${req.originalUrl}`)
    next()
  })
  app.use(express.json())

  app.get('/', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    return getFile('convictData', req.params[1], res)
  })
  app.get('/offenders/:individualid/sentenceplans', (req, res) => {
    return getFile('sentencePlanSummary', req.params.individualid, res)
  })
  app.post('/sentenceplan', (req, res) => {
    logger.info(`MockAPI creating NEW sentence plan with: ${JSON.stringify(req.body)}`)
    return getFile('sentencePlan', req.body.offenderId, res)
  })
  app.get('/sentenceplans/:planid/comments', (req, res) => {
    return getFile('sentencePlanComments', req.params.planid, res)
  })
  app.put('/sentenceplans/:planid/comments', (req, res) => {
    if (req.params.planid === 999) {
      res.sendStatus(400)
    } else {
      logger.debug(`MockAPI saving comment ${JSON.stringify(req.body)}`)
      res.sendStatus(200)
    }
  })
  app.get('/sentenceplans/:planid', (req, res) => {
    return getFile('sentencePlan', req.params.planid, res)
  })

  app.get('/sentenceplans/:planid/objectives', (req, res) => {
    return getFile('sentencePlanObjectives', req.params.planid, res)
  })

  app.post('/sentenceplans/:planid/objectives', (req, res) => {
    return getFile('sentencePlanObjectives', req.params.planid, res)
  })

  app.listen(18081)
}
module.exports = { createMockAPI }
