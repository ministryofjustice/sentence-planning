const { removeUrlLevels } = require('../../common/utils/util')

const getObjectiveReview = async ({ renderInfo, path }, res) => {
  const nextUrl = path.substring(0, path.lastIndexOf('/'))
  const backUrl = removeUrlLevels(path, 3)
  Object.assign(renderInfo, { nextUrl, backUrl })
  return res.render(`${__dirname}/index`, renderInfo)
}

module.exports = { getObjectiveReview }
