const { readFile } = require('fs')

const app = require('express')()

const getFile = (directory, file, res) => {
  const path = `mockServer/${directory}/${file}.json`
  // info(`apiMockServer requesting ${path}`)
  readFile(path, (err, sentencePlan) => {
    return err ? res.status(404).send(`Invalid path ${path}`) : res.send(JSON.parse(sentencePlan))
  })
}

export default function createMockAPI() {
  app.get('/', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    return getFile('convictData', req.params[1], res)
  })
  app.listen(18080)
}
