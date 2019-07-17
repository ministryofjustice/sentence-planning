const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { searchBreadcrumb, summaryBreadcrumb } = require('./breadcrumbHelpers')

module.exports = () => async (req, res) => {
  const { locals } = res
  const { oasysOffenderId, forename1, familyName } = locals
  locals.breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
  locals.oasysSentencePlan.createdDate = getTimeStringFromISO8601(locals.oasysSentencePlan.createdDate)
  return res.render('../views/pages/oaSysSentencePlan', res.locals.oasysSentencePlan)
}
