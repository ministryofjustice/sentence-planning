const { removeUrlLevels } = require('../../common/utils/util')

const getCloseObjective = async ({ path, errors, errorSummary, body, renderInfo, params: { planId } }, res) => {
  const backUrl = removeUrlLevels(path, 2)
  return res.render(`${__dirname}/index`, {
    ...renderInfo,
    backUrl,
    body,
    planId,
    errors,
    errorSummary,
  })
}

module.exports = { getCloseObjective }
