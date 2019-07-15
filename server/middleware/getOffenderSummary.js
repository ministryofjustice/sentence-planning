const logger = require('../../log')
const { searchBreadcrumb } = require('./breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  try {
    const { locals } = res
    const { oasysOffenderId } = locals
    const linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/`

    const sentencePlans = locals.formObject.sentencePlans
      .filter(({ dateCreated = '', sentencePlanId = '' }) => dateCreated && sentencePlanId)
      .sort(({ dateCreated: a }, { dateCreated: b }) => a < b)
    locals.sentencePlans = sentencePlans.map(({ dateCreated, sentencePlanId }) => {
      return {
        key: {
          text: getTimeStringFromISO8601(dateCreated),
        },
        actions: {
          items: [
            {
              href: `${linkRoot}sentence-plan/${sentencePlanId}`,
              text: 'View',
              visuallyHiddenText: `Action ${sentencePlanId}`,
            },
          ],
        },
      }
    })
    if (sentencePlans.length > 0) locals.latestSentencePlanId = sentencePlans[0].sentencePlanId
    if (locals.oasysSentencePlan) {
      const { sentencePlanId, createdDate } = locals.oasysSentencePlan
      locals.sentencePlans.push({
        key: {
          text: getTimeStringFromISO8601(createdDate),
        },
        value: {
          text: 'OaSys based',
        },
        actions: {
          items: [
            {
              href: `${linkRoot}oasys-sentence-plan/${sentencePlanId}`,
              text: 'View',
              visuallyHiddenText: `Action ${sentencePlanId}`,
            },
          ],
        },
      })
    }
    locals.breadcrumbs = [searchBreadcrumb()]
    return res.render('pages/offenderSummary', locals)
  } catch (error) {
    logger.warn(`Could not render step ERROR: ${error}`)
    return res.redirect('/')
  }
}
