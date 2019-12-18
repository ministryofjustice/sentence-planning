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
  let displayObjective = {}

  try {
    const needs = await getSentencePlanNeeds(planId, token)
    displayNeeds = needs
      .map(need => {
        const returnNeed = {
          value: need.id,
          html: need.description,
        }
        if (need.riskOfHarm) {
          returnNeed.html += ' - <span class="risk"> Risk of serious harm'
        }
        return returnNeed
      })
      .sort(sortObject('html'))
  } catch (error) {
    logger.error(`Could not retrieve needs for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }

  try {
    if (body.objective !== undefined) {
      displayObjective = body
    } else if (objectiveId.toLowerCase() !== 'new') {
      displayObjective = await getSentencePlanObjective(planId, objectiveId, token)
    }

    // determine if any needs should be checked when we display the page
    if (displayObjective.needs) {
      if (!(displayObjective.needs instanceof Array)) {
        displayObjective.needs = [displayObjective.needs]
      }
      displayObjective.needs.forEach(needsId => {
        displayNeeds.forEach(need => {
          if (need.value === needsId) {
            // eslint-disable-next-line no-param-reassign
            need.checked = true
          }
        })
      })
    }

    renderDetails.displayNeeds = displayNeeds
    renderDetails.objective = displayObjective.objective

    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getObjective }
