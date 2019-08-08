const { offenderSummaryData } = require('../services/offenderSummaryService')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

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
      avatar = '/assets/images/blank-portrait.png',
      identifiers: { crn = '', nomisId = '' },
      sentencePlan: oasysSentencePlan,
      keyWorker,
      offence: {
        mainOffence,
        sentenceType,
        sentenceLength,
        startDate,
        dateISPDue,
        paromEligibilityDate,
        expectedHDCReleaseDate,
      },
    } = summaryData
    res.locals = Object.assign(res.locals, {
      oasysOffenderId,
      forename1,
      forename2,
      familyName,
      avatar,
      crn,
      nomisId,
      oasysSentencePlan,
      keyWorker,
      mainOffence,
      sentenceType,
      sentenceLength,
      startDate: getTimeStringFromISO8601(startDate),
      dateISPDue: getTimeStringFromISO8601(dateISPDue),
      paromEligibilityDate: getTimeStringFromISO8601(paromEligibilityDate),
      expectedHDCReleaseDate: getTimeStringFromISO8601(expectedHDCReleaseDate),
    })
    return next()
  })
}
