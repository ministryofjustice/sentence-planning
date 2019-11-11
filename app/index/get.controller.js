const { request } = require('superagent')
const api = require('../../common/config.js').apis.sentencePlanning
const logger = require('../../common/logging/logger')
const displayText = require('./display-text')

module.exports = async (req, res) => {
  // get active plan
  const response = await request
    .get(api.url)
    .query({ api_key: 'DEMO_KEY', date: '2017-08-02' })
    .timeout({
      response: api.timeout.response,
      deadline: api.timeout.deadline,
    })
    .end((err, res) => {
      if (err) {
        logger.error(`Error retrieving current plan: ${err}`)
        throw new Error(``)
      }
      console.log(res.body.url)
      console.log(res.body.explanation)
    })

  if (response){

  }
  res.render('app/index/index', displayText)
}
