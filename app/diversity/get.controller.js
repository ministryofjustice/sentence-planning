const displayText = require('./displayText')

const diversityGet = (req, res) => {
  const renderInfo = {}
  res.render(`${__dirname}/index`, { ...displayText, ...renderInfo })
}

module.exports = { diversityGet }
