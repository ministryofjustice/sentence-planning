const { body } = require('express-validator')
const { logger } = require('../../../../common/logging/logger')
const { setSentencePlanComment } = require('../../../../common/data/sentencePlanningApi')
const { getContactArrangements } = require('./get.controller')

const validationRules = () => {
  return [
    body('contactArrangements', 'Enter contact arrangements')
      .isLength({ min: 1 })
      .trim()
      .escape(),
  ]
}

const postContactArrangements = async (req, res) => {
  const {
    path,
    errors,
    params: { planId },
    headers: { 'x-auth-token': token },
    body: { contactArrangements },
  } = req
  if (errors) {
    return getContactArrangements(req, res)
  }
  try {
    const comment = [
      {
        comment: contactArrangements,
        commentType: 'LIAISON_ARRANGEMENTS',
      },
    ]
    await setSentencePlanComment(planId, comment, token)
    return res.redirect(`${path.substring(0, path.lastIndexOf('/'))}#contact`)
  } catch (error) {
    logger.error(`Could not save sentence plan comments 'LIAISON_ARRANGEMENTS' for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postContactArrangements, contactArrangementsValidationRules: validationRules }
