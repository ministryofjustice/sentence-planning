const { offenderSummaryData } = require('../services/offenderSummaryService')
const logger = require('../../log')

const generateSummaryBreadcrumb = (oasysOffenderId, forename1, familyName, breadcrumbs = []) => {
  try {
    return [
      ...breadcrumbs,
      {
        text: 'Search',
        href: '/',
      },
      {
        text: `${forename1} ${familyName}`,
        href: `/offender-summary/oasys-offender-id/${oasysOffenderId}`,
      },
    ]
  } catch (err) {
    logger.warn(`Could not generate breadcrumbs: ${err}`)
    return breadcrumbs
  }
}

module.exports = (req, res, next) => {
  const {
    params: { idType, id: oasysOffenderId },
  } = req
  const {
    locals: { breadcrumbs },
  } = res
  offenderSummaryData(idType, oasysOffenderId, (err, summaryData = {}) => {
    if (err) {
      return res.render('../views/pages/unknownRecord', { oasysOffenderId, idType })
    }
    const {
      forename1,
      forename2 = '',
      familyName,
      identifiers: { crn = '', nomisId = '' },
    } = summaryData
    res.locals = {
      ...res.locals,
      oasysOffenderId,
      forename1,
      forename2,
      familyName,
      crn,
      nomisId,
    }
    res.locals.breadcrumbs = generateSummaryBreadcrumb(oasysOffenderId, forename1, familyName, breadcrumbs)
    return next()
  })
}
