const displayText = require('./displayText')
const sentencePlanSummary = require('../../common/data/offenderSentencePlanSummary')

const hasActivePlan = plans => {
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

const getSentencePlanData = async (req, res) => {
  const plans = await sentencePlanSummary(req.params.id, req.session['x-auth-token'])
  const renderInfo = {}
  if (!plans || isEmptyObject(plans)) {
    renderInfo.activePlan = false
  } else {
    renderInfo.activePlan = hasActivePlan(plans)
  }
  renderInfo.individualId = req.params.id
  res.render('app/plans/index', { ...displayText, ...renderInfo })
}

module.exports = getSentencePlanData
