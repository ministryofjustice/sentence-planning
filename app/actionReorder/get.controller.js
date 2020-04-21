const getActionReorder = async ({ renderInfo, path }, res) => {
  const backUrl = `${path.substring(0, path.lastIndexOf('/'))}`
  Object.assign(renderInfo, { backUrl })
  return res.render(`${__dirname}/index`, renderInfo)
}

module.exports = { getActionReorder }
