const { sentencePlanChildrenBreadcrumbs } = require('../middleware/breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  const {
    params: { sentencePlanId, id: oasysOffenderId = '' },
  } = req
  const { locals } = res
  const {
    forename1,
    familyName,
    formObject: { sentencePlans },
  } = locals
  const breadcrumbs = sentencePlanChildrenBreadcrumbs(
    oasysOffenderId,
    forename1,
    familyName,
    sentencePlanId,
    getTimeStringFromISO8601(
      sentencePlans.find(({ sentencePlanId: id }) => {
        return id === sentencePlanId
      }).dateCreated
    )
  )
  return res.render('../views/pages/sentencePlanSummary', { breadcrumbs })
}
