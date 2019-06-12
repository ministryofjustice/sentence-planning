const fs = require('fs')
const app = require('express')()
const logger = require('../log.js')

module.exports = function createMockAPI() {
  app.get('/', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    const path = `mockServer/convictData/${req.params[1]}.json`
    logger.info(`apiMockServer requesting ${path}`)
    fs.readFile(path, (err, convictData) => {
      return err ? res.status(404).send('Invalid CRN') : res.send(JSON.parse(convictData))
    })
  })
  app.get(/offenders\/(nomisId|oasysOffenderId)\/([\w]+)\/sentencePlans\/latest$/, (req, res) => {
    const path = `mockServer/sentencePlan/${req.params[1]}.json`
    logger.info(`apiMockServer requesting ${path}`)
    fs.readFile(path, (err, sentencePlan) => {
      return err ? res.status(404).send('Invalid nomisId') : res.send(JSON.parse(sentencePlan))
    })
  })
  app.listen(process.env.PORT || 18080)
}
