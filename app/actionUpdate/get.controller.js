const { logger } = require('../../common/logging/logger')
const { removeUrlLevels } = require('../../common/utils/util')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')

const getActionUpdate = ({ action, motivationList, path, errors, errorSummary, body, renderInfo }, res) => {
  try {
    const backUrl = `${removeUrlLevels(path, 2)}`
    return res.render(`${__dirname}/index`, {
      ...body,
      ...renderInfo,
      errors,
      errorSummary,
      actionText: action.actionText,
      ...getTargetDate(action, body),
      motivationList,
      ...getResponsibility(action, body),
      ...getStatus(action, body),
      backUrl,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to update an action. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getActionUpdate }
