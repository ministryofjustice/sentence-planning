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
    body('comments')
      .trim()
      .escape(),
  ]
}

const postComments = async (req, res) => {
  const {
    errors,
    body: { comments = '' },
    tokens,
    path,
    params: { planId },
  } = req
  if (errors) {
    const wordsOver = countWords(comments) - wordsAllowed
    req.renderInfo = { wordsOver: wordsOver > 0 ? wordsOver : 0 }
    return getComments(req, res)
  }
  try {
    const comment = [
      {
        comment: comments,
        commentType: 'THEIR_SUMMARY',
      },
    ]
    await setSentencePlanComment(planId, comment, tokens)
    return res.redirect(path.substring(0, path.lastIndexOf('/')))
  } catch (error) {
    logger.error(`Could not save sentence plan comments 'THEIR_SUMMARY' for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postComments, commentsValidationRules: validationRules }
