const logger = require('../logging/logger')
const { createSentencePlan } = require('../data/sentencePlanningApi')
const { isEmptyObject } = require('../utils/util')

module.exports = async (req, res, next) => {
  const {
    params: { id },
    headers,
    originalUrl,
  } = req
  try {
    const sentencePlanData = await createSentencePlan(id, headers['x-auth-token'])
    if (isEmptyObject(sentencePlanData)) throw new Error('Returned invalid sentencePlan object')
    return res.redirect(originalUrl.replace('new', sentencePlanData.id))
  } catch (error) {
    logger.error(`Could not create sentence plan for ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}
