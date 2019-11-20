const displayText = require('./displayText')

const diversityPost = async (req, res) => {
  const renderInfo = {}
  res.render(`${__dirname}/index`, { ...displayText, ...renderInfo })
}

module.exports = { diversityPost }
