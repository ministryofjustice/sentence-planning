const displayText = require('./displayText')
const getSentencePlanSummary = require('../../common/data/offenderSentencePlanSummary')

const isActivePlan = plans => {
  let planPresent = false
  plans.forEach(plan => {
    if (!plan.completedDate) {
      planPresent = true
    }
  })
  return planPresent
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length
}

const getSentencePlanData = (req, res) => {
  const individualId = req.params.id

  getSentencePlanSummary(req, res, individualId).then(() => {
    const renderInfo = {}
    if (!res.body || isEmptyObject(res.body)) {
      renderInfo.activePlan = false
    } else {
      renderInfo.activePlan = isActivePlan(res.body)
    }
    renderInfo.individualId = individualId
    res.render('app/plans/index', { ...displayText, ...renderInfo })
  })
}

module.exports = getSentencePlanData
