const displayText = require('./displayText')
const { getSentencePlanSummary } = require('../../common/data/offenderSentencePlanSummary')

const hasActivePlan = plans => {
  if (isEmptyObject(plans)) return false
  let activePlanPresent = false
  plans.forEach(plan => {
    if (!plan.completedDate) {
      activePlanPresent = true
    }
  })
  return activePlanPresent
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length
}

const sentencePlanSummary = async (req, res) => {
  const plans = await getSentencePlanSummary(req.params.id, req.session['x-auth-token'])
  const renderInfo = {}
  if (!plans || isEmptyObject(plans)) {
    renderInfo.activePlan = false
  } else {
    renderInfo.activePlan = hasActivePlan(plans)
  }
  renderInfo.individualId = req.params.id
  res.render(`${__dirname}/index`, { ...displayText, ...renderInfo })
}

module.exports = { sentencePlanSummary, hasActivePlan }
