const { body } = require('express-validator')
const { logger } = require('../../common/logging/logger')
const { setSentencePlanComment } = require('../../common/data/sentencePlanningApi')
const { getComments } = require('./get.controller')
const { countWords } = require('../../common/utils/util')

const wordsAllowed = 250

const validationRules = () => {
  return [
    body('comments')
      .isLength({ min: 1 })
      .withMessage('Record the individual’s comments'),
    body('comments')
      .custom(value => {
        return countWords(value) <= wordsAllowed
      })
      .withMessage('Individual’s comments must be 250 words or fewer'),
  ]
}

const postComments = async (req, res) => {
  if (req.errors) {
    const wordsOver = countWords(req.body.comments) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    return getComments(req, res)
  }
  try {
    const comment = [
      {
        comment: req.body.comments,
        commentType: 'THEIR_SUMMARY',
      },
    ]
    await setSentencePlanComment(req.params.planid, comment, req.session['x-auth-token'])
    return res.redirect(req.path.substring(0, req.path.lastIndexOf('/')))
  } catch (error) {
    logger.error(`Could not save sentence plan comments 'THEIR_SUMMARY' for plan ${req.params.planid}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postComments, commentsValidationRules: validationRules }
