const { removeUrlLevels } = require('../../common/utils/util')

const getCloseObjective = async ({ renderInfo = {}, path }, res) => {
  const nextUrl = path.substring(0, path.lastIndexOf('/'))
  const backUrl = `${removeUrlLevels(path, 2)}/${renderInfo.objective.id}`
  Object.assign(renderInfo, { nextUrl, backUrl })
  return res.render(`${__dirname}/index`, renderInfo)
}

module.exports = { getCloseObjective }
