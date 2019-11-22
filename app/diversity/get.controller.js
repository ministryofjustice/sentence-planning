const getDiversity = (req, res) => {
  const renderInfo = {}
  res.render(`${__dirname}/index`, { ...renderInfo })
}

module.exports = { getDiversity }
