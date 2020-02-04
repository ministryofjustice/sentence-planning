const { removeUrlLevels } = require('../../common/utils/util')

const getObjectiveView = async ({ renderInfo, path }, res) => {
  const backUrl = removeUrlLevels(path, 2)
  Object.assign(renderInfo, { nextUrl: path, backUrl })
  return res.render(`${__dirname}/index`, renderInfo)
}

module.exports = { getObjectiveView }
