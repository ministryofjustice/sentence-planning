const { logger } = require('../../../common/logging/logger')
const { getSentencePlan, getSentencePlanMeetings } = require('../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../common/utils/getCommentText')

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

  objectives = objectives.map(objective => {
    const currentObjective = objective
    currentObjective.type = 'unsorted'

    if (currentObjective.actions.some(action => ['IN_PROGRESS', 'PAUSED'].includes(action.status))) {
      currentObjective.type = 'active'
    } else if (currentObjective.actions.every(action => ['NOT_STARTED'].includes(action.status))) {
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

  // get review meetings
  try {
    meetings = await getSentencePlanMeetings(id, token)
  } catch (error) {
    logger.error(`Could not retrieve meetings for offender ${id}, error: ${error}`)
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
