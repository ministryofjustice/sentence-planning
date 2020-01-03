const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjective, getSentencePlanNeeds } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels, sortObject } = require('../../common/utils/util')

const getObjective = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId, objectiveId }, session: { 'x-auth-token': token } },
  res
) => {
  const nexturl = path.substring(0, path.lastIndexOf('/'))
  const backurl = removeUrlLevels(path, 2)
  const renderDetails = { ...renderInfo, nexturl, backurl }
  let displayNeeds
  let displayObjective = { description: '', needs: [] }

  // get the saved or submitted objective
  try {
    if (body.objective !== undefined) {
      displayObjective.description = body.objective
      displayObjective.needs = body.needs || []
    } else if (objectiveId.toLowerCase() !== 'new') {
      const savedObjective = await getSentencePlanObjective(planId, objectiveId, token)

      // convert need to an array if only one has been passed back
      if (savedObjective.needs) {
        if (!(savedObjective.needs instanceof Array)) {
          savedObjective.needs = [savedObjective.needs]
        }
      }
      displayObjective = savedObjective
    }
  } catch (error) {
    logger.error(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }

  // get all the needs that apply to this sentence plan
  try {
    const needs = await getSentencePlanNeeds(planId, token)
    // convert to format for display
    displayNeeds = needs
      .map(need => {
        const returnNeed = {
          value: need.id,
          html: need.description,
          active: need.active,
        }
        if (need.riskOfHarm) {
          returnNeed.html += ' - <span class="risk"> Risk of serious harm'
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

    renderDetails.displayNeeds = displayNeeds
    renderDetails.description = displayObjective.description

    return res.render(`${__dirname}/index`, { errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve needs for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getObjective }
