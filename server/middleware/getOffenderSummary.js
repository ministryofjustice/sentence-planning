const logger = require('../../log')
const { searchBreadcrumb } = require('./breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  try {
    const { locals } = res
    const { oasysOffenderId, formObject } = locals
    const linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/`

    if (formObject.sentencePlans) {
      const sortedSentencePlans = formObject.sentencePlans
        .filter(({ dateCreated = '', sentencePlanId = '' }) => dateCreated && sentencePlanId)
        .sort(({ dateCreated: a }, { dateCreated: b }) => a < b)
      locals.sentencePlans = sortedSentencePlans.map(({ dateCreated, sentencePlanId }) => {
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
      if (sortedSentencePlans.length > 0) locals.latestSentencePlanId = sortedSentencePlans[0].sentencePlanId
    } else {
      locals.sentencePlans = []
    }
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
    logger.warn(`Could not render offender summary ERROR: ${error}`)
    return res.redirect('/')
  }
}
