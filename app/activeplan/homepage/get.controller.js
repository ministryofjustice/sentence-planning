const { logger } = require('../../../common/logging/logger')
const { getSentencePlan, getSentencePlanMeetings } = require('../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../common/utils/getCommentText')
const { groupBy } = require('../../../common/utils/util')

const getHomepage = async (req, res) => {
  const {
    session: { planStarted = false, 'x-auth-token': token },
    params: { planId, id },
  } = req

  let meetings
  let comments
  let objectives

  delete req.session.planStarted

  // get the sentence plan
  try {
    ;({ comments, objectives } = await getSentencePlan(planId, token))
  } catch (error) {
    logger.error(`Could not retrieve active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }

  // determine the status of each objective
  objectives = objectives.map(objective => {
    const currentObjective = objective

    // objectives default to active if not caught with the rules below
    currentObjective.type = 'active'

    if (currentObjective.actions.every(action => ['NOT_STARTED'].includes(action.status))) {
      currentObjective.type = 'future'
    } else if (
      currentObjective.actions.every(action =>
        ['COMPLETED', 'PARTIALLY_COMPLETED', 'ABANDONED'].includes(action.status)
      )
    ) {
      currentObjective.type = 'closed'
    }
    return currentObjective
  })

  objectives = groupBy(objectives, item => {
    return item.type
  })

  // get review meetings
  try {
    meetings = await getSentencePlanMeetings(planId, token)
  } catch (error) {
    logger.error(`Could not retrieve meetings for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }

  return res.render(`${__dirname}/index`, {
    planId,
    id,
    planStarted,
    objectives,
    contactArrangements: getCommentText(comments, 'LIAISON_ARRANGEMENTS'),
    diversity: getCommentText(comments, 'YOUR_RESPONSIVITY'),
    decisions: getCommentText(comments, 'YOUR_SUMMARY'),
    needToKnow: getCommentText(comments, 'THEIR_RESPONSIVITY'),
    comments: getCommentText(comments, 'THEIR_SUMMARY'),
    meetings,
  })
}

module.exports = { getHomepage }
