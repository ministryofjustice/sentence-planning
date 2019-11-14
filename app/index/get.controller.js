const displayText = require('./displayText')
const getSentencePlanSummary = require('../../common/data/offenderSentencePlanSummary')

const activePlan = plans => {
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
  const individualId = req.params.offenderid // TODO: get id from session

  getSentencePlanSummary(req, res, individualId).then(() => {
    const renderParams = {}
    if (isEmptyObject(res.body)) {
      renderParams.activePlan = false
    } else {
      renderParams.activePlan = activePlan(res.body)
    }
    res.render('app/index/index', { ...displayText, ...renderParams })
  })
}

module.exports = getSentencePlanData
