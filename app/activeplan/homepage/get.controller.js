const { logger } = require('../../../common/logging/logger')
const { getSentencePlan, getSentencePlanMeetings } = require('../../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../../common/utils/getCommentText')
const { groupBy, getObjectiveType, hasClosedStatus } = require('../../../common/utils/util')
const {
  COMMENT_TYPES: { YOUR_RESPONSIVITY, YOUR_SUMMARY, THEIR_RESPONSIVITY, THEIR_SUMMARY, LIAISON_ARRANGEMENTS },
} = require('../../../common/utils/constants')

const getHomepage = async (req, res) => {
  const {
    tokens,
    session: { planStarted = false },
    params: { planId, id },
  } = req

  let meetings
  let comments
  let objectives

  delete req.session.planStarted

  // get the sentence plan
  try {
    ;({ comments, objectives = [] } = await getSentencePlan(planId, tokens))
  } catch (error) {
    logger.error(`Could not retrieve active sentence plan ${planId} for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }

  // determine the status of each objective
  objectives = objectives.map(objective => {
    const currentObjective = objective

    currentObjective.actionsCompleted = currentObjective.actions.filter(({ status }) => hasClosedStatus(status)).length

    currentObjective.type = getObjectiveType(currentObjective)
    return currentObjective
  })

  objectives = groupBy(objectives, ({ type }) => type)

  // get review meetings
  try {
    meetings = await getSentencePlanMeetings(id, tokens)
  } catch (error) {
    logger.error(`Could not retrieve meetings for offender ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }

  return res.render(`${__dirname}/index`, {
    planId,
    id,
    planStarted,
    objectives,
    contactArrangements: getCommentText(comments, LIAISON_ARRANGEMENTS),
    diversity: getCommentText(comments, YOUR_RESPONSIVITY),
    decisions: getCommentText(comments, YOUR_SUMMARY),
    needToKnow: getCommentText(comments, THEIR_RESPONSIVITY),
    comments: getCommentText(comments, THEIR_SUMMARY),
    meetings,
  })
}

module.exports = { getHomepage }
