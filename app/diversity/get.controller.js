const displayText = require('./displayText')

const diversityGet = (req, res) => {
  const renderInfo = {}
  console.log(req.params.planid)
  res.render(`${__dirname}/index`, { ...displayText, ...renderInfo })
}

module.exports = { diversityGet }
