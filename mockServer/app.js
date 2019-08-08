const fs = require('fs')
const app = require('express')()
const logger = require('../log.js')

const getFile = (directory, file, res) => {
  const isTemplate = file.match(/^(111|222|333)/)
  const path = `mockServer/${directory}/${isTemplate ? isTemplate[0] : file}.json`
  logger.info(`apiMockServer requesting ${path}`)
  fs.readFile(path, (err, sentencePlan) => {
    return err ? res.status(404).send(`Invalid path ${path}`) : res.send(JSON.parse(sentencePlan))
  })
}

module.exports = function createMockAPI() {
  app.get('/', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    return getFile('convictData', req.params[1], res)
  })
  app.get(/offenders\/(nomisId|oasysOffenderId)\/([\w]+)\/sentencePlans\/latest$/, (req, res) => {
    return getFile('sentencePlan', req.params[1], res)
  })
  app.get(/offenders\/oasysOffenderId\/([\w]+)\/assessments\/latest\/needs$/, (req, res) => {
    return getFile('needs', req.params[0], res)
  })
  app.listen(18080)
}
