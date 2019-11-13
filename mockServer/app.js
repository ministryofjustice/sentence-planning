const { readFile } = require('fs')
const app = require('express')()

const logger = require('../common/logging/logger')

const getFile = (directory, file, res) => {
  const path = `mockServer/${directory}/${file}.json`
  logger.debug(`apiMockServer requesting ${path}`)
  readFile(path, (err, sentencePlan) => {
    return err ? res.status(404).send(`Invalid path ${path}`) : res.send(JSON.parse(sentencePlan))
  })
}

function createMockAPI() {
  app.get('/', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    return getFile('convictData', req.params[1], res)
  })
  app.get('/offenders/:individualid/sentenceplans', (req, res) => {
    return getFile('sentenceplans', req.params.individualid, res)
  })
  app.listen(18081)
}
module.exports = { createMockAPI }
