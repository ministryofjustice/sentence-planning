const logger = require('../../log')
const { searchBreadcrumb } = require('./breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  try {
    const { locals } = res
    const { oasysOffenderId } = locals

    locals.sentencePlans = locals.sentencePlans
      .sort(({ createdDate: a }, { createdDate: b }) => a < b)
      .map(({ createdDate, planId, legacy }) => {
        return {
          key: {
            text: getTimeStringFromISO8601(createdDate),
          },
          value: {
            text: legacy ? 'OaSys based' : '',
          },
          actions: {
            items: [
              {
                href: `/sentence-plan/oasys-offender-id/${oasysOffenderId}/${
                  legacy ? 'oasys-sentence-plan' : 'sentence-plan'
                }/${planId}`,
                text: 'View',
                visuallyHiddenText: `Action ${planId}`,
              },
            ],
          },
        }
      })
    locals.latestSentencePlanId = locals.sentencePlans.find(({ completedDate }) => !completedDate) || null

    locals.breadcrumbs = [searchBreadcrumb()]
    return res.render('pages/offenderSummary', locals)
  } catch (error) {
    logger.warn(`Could not render offender summary ERROR: ${error}`)
    return res.redirect('/')
  }
}
