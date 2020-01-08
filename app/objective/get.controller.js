const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjective, getSentencePlanNeeds } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels, sortObject } = require('../../common/utils/util')

const getObjective = async (
  {
    path,
    errors,
    errorSummary,
    body: { objective = null, needs = [] },
    renderInfo,
    params: { planId, objectiveId },
    session: { 'x-auth-token': token },
  },
  res
) => {
  const nexturl = path.substring(0, path.lastIndexOf('/'))
  const backurl = removeUrlLevels(path, 2)
  const renderDetails = { ...renderInfo, nexturl, backurl }
  let displayObjective = { description: '', needs: [] }

  // get the saved or submitted objective
  try {
    if (objective) {
      displayObjective.description = objective
      displayObjective.needs = needs
    } else if (objectiveId.toLowerCase() !== 'new') {
      const savedObjective = await getSentencePlanObjective(planId, objectiveId, token)

      // convert need to an array if only one has been passed back
      if (savedObjective.needs && !(savedObjective.needs instanceof Array)) {
        savedObjective.needs = [savedObjective.needs]
      }
      displayObjective = savedObjective
    }
  } catch (error) {
    logger.error(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }

  // get all the needs that apply to this sentence plan
  try {
    const displayNeeds = await getSentencePlanNeeds(planId, token)
    // convert to format for display
    renderDetails.displayNeeds = displayNeeds
      .map(({ id: value, name: html, active, riskOfHarm = false }) => {
        const returnNeed = {
          value,
          html,
          active,
        }
        if (riskOfHarm) {
          returnNeed.html += ' - <span class="risk"> Risk of serious harm</span>'
        }

        if (displayObjective.needs.includes(returnNeed.value)) {
          returnNeed.active = true
          returnNeed.checked = true
        }
        return returnNeed
      })
      // don't display inactive needs
      .filter(need => need.active === true)
      // display needs alphabetically
      .sort(sortObject('html'))

    renderDetails.description = displayObjective.description

    return res.render(`${__dirname}/index`, { errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve needs for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getObjective }
