const { logger } = require('../../../../common/logging/logger')
const { getSentencePlanMeeting } = require('../../../../common/data/sentencePlanningApi')

const getMeeting = async (req, res) => {
  const {
    headers: { 'x-auth-token': token },
    params: { planId, id, meetingId },
  } = req

  // get the sentence plan
  try {
    const meeting = await getSentencePlanMeeting(planId, meetingId, token)
    return res.render(`${__dirname}/index`, {
      backurl: `/individual-id/${id}/plan/${planId}#meetings`,
      meeting,
    })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan meeting ${meetingId} for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getMeeting }
