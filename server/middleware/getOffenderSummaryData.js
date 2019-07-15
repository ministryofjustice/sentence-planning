const { offenderSummaryData } = require('../services/offenderSummaryService')

module.exports = () => async (req, res, next) => {
  const {
    params: { idType, id: oasysOffenderId },
  } = req
  offenderSummaryData(idType, oasysOffenderId, (err, summaryData = {}) => {
    if (err) {
      return res.render('../views/pages/unknownRecord', { oasysOffenderId, idType })
    }
    const {
      forename1,
      forename2 = '',
      familyName,
      identifiers: { crn = '', nomisId = '' },
      sentencePlan: oasysSentencePlan,
    } = summaryData
    res.locals = Object.assign(res.locals, {
      oasysOffenderId,
      forename1,
      forename2,
      familyName,
      crn,
      nomisId,
      oasysSentencePlan,
    })
    return next()
  })
}
