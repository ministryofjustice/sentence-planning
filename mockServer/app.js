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
  app.post('/offenders/:individualid/sentenceplans', ({ params: { individualid } }, res) => {
    logger.info(`MockAPI creating NEW sentence plan with: ${individualid}`)
    return getFile('sentencePlans', individualid, res)
  })
  app.get('/sentenceplans/:planId', ({ params: { planId } }, res) => {
    logger.info(`MockAPI returning sentence plan with id: ${planId}}`)
    return getFile('sentencePlans', planId, res)
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

  app.get('/sentenceplans/:planid/objectives/:objectiveid', (req, res) => {
    return getFile('sentencePlanObjectives', req.params.objectiveid, res)
  })

  app.post('/sentenceplans/:planid/objectives', (req, res) => {
    logger.debug(`MockAPI saving new objective ${JSON.stringify(req.body)}`)
    return getFile('sentencePlanObjectives', '1', res)
  })

  app.put('/sentenceplans/:planid/objectives/:objectiveid', (req, res) => {
    if (req.params.objectiveid === 999) {
      res.sendStatus(400)
    }
    logger.debug(`MockAPI saving objective ${JSON.stringify(req.body)}`)
    return getFile('sentencePlanObjectives', req.params.objectiveid, res)
  })

  app.get('/sentenceplans/:planid/needs', (req, res) => {
    return getFile('sentencePlanNeeds', req.params.planid, res)
  })

  app.get('/sentenceplans/:planid/objectives/:objectiveid/actions/:actionId', (req, res) => {
    return getFile('sentencePlanActions', req.params.actionId, res)
  })

  app.post('/sentenceplans/:planid/objectives/:objectiveid/actions', (req, res) => {
    logger.debug(`MockAPI saving new action ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.put('/sentenceplans/:planid/objectives/:objectiveid/actions/:actionId', (req, res) => {
    if (req.params.actionId === 999) {
      res.sendStatus(400)
    }
    logger.debug(`MockAPI saving action ${JSON.stringify(req.body)}`)
    return getFile('sentencePlanActions', req.params.objectiveid, res)
  })

  app.get('/interventions', (req, res) => {
    return getFile('interventions', 'interventions', res)
  })

  app.get('/motivation', (req, res) => {
    return getFile('motivations', 'motivations', res)
  })

  app.get('/offenders/:id/reviews', (req, res) => {
    return getFile('sentencePlanMeetings/summary', req.params.id, res)
  })

  app.get('/offenders/:id/reviews/:meetingId', (req, res) => {
    return getFile('sentencePlanMeetings/minutes', req.params.meetingId, res)
  })

  app.post('/sentenceplans/:planid/reviews', (req, res) => {
    logger.debug(`MockAPI saving new meeting ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.post('/sentenceplans/:planid/start', (req, res) => {
    logger.debug(`MockAPI starting plan ${req.params.planid}`)
    return res.sendStatus(200)
  })

  app.post('/sentenceplans/:planid/end', (req, res) => {
    logger.debug(`MockAPI ending plan ${req.params.planid}`)
    return res.sendStatus(200)
  })

  app.listen(18081)
}
module.exports = { createMockAPI }
