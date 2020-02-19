const { body } = require('express-validator')
const { logger } = require('../../../../common/logging/logger')
const { addSentencePlanMeeting } = require('../../../../common/data/sentencePlanningApi')
const { getAddMeeting } = require('./get.controller')
const { BLANK_ERROR } = require('../../../../common/utils/formatErrors')
const { isValidDate } = require('../../../../common/utils/util')

const validationRules = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const anyPresent = (
    _val,
    {
      req: {
        body: { 'meeting-date-Day': day, 'meeting-date-Month': month, 'meeting-date-Year': year },
      },
    }
  ) => day !== '' || month !== '' || year !== ''
  return [
    body('comments', 'Enter meeting details')
      .isLength({ min: 1 })
      .trim()
      .escape(),
    body('attendees')
      .trim()
      .escape(),
    body('meeting-date-Day')
      .custom(anyPresent)
      .withMessage('Enter the meeting date')
      .bail()
      .not()
      .isEmpty()
      .withMessage('Enter the day for the meeting')
      .bail()
      .isInt({ min: 1, max: 31 })
      .withMessage('Day must be a number between 1 and 31'),
    body('meeting-date-Month')
      .custom(anyPresent)
      .withMessage(BLANK_ERROR)
      .bail()
      .not()
      .isEmpty()
      .withMessage('Enter the month for the meeting')
      .bail()
      .isInt({ min: 1, max: 12 })
      .withMessage('Month must be a number between 1 and 12'),
    body('meeting-date-Year')
      .custom(anyPresent)
      .withMessage(BLANK_ERROR)
      .bail()
      .not()
      .isEmpty()
      .withMessage('Enter the year for the meeting')
      .bail()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be a 4-digit number')
      .bail()
      .matches(/^20/)
      .withMessage('Year must start with 20')
      .bail()
      .isInt({ min: currentYear - 10 })
      .withMessage('Year must be no more than 10 years in the past')
      .bail()
      .custom(
        (
          year,
          {
            req: {
              body: { 'meeting-date-Month': month },
            },
          }
        ) => new Date(year, month - 1) <= currentDate
      )
      .withMessage('Meeting date must be in the past')
      .bail()
      .custom(
        (
          year,
          {
            req: {
              body: { 'meeting-date-Month': month, 'meeting-date-Day': day },
            },
          }
        ) => {
          return isValidDate(day, month, year)
        }
      )
      .withMessage('Meeting date must be valid'),
  ]
}

const postAddMeeting = async (req, res) => {
  const {
    tokens,
    path,
    errors,
    params: { planId },
    body: {
      comments = '',
      attendees = '',
      'meeting-date-Day': meetingDateDay = '',
      'meeting-date-Month': meetingDateMonth = '',
      'meeting-date-Year': meetingDateYear = '',
    },
  } = req
  if (errors) {
    return getAddMeeting(req, res)
  }
  try {
    const meetingDate = new Date(`${meetingDateYear}-${meetingDateMonth}-${meetingDateDay}`).toISOString()
    const meeting = {
      comments,
      attendees,
      dateOfBoard: meetingDate,
    }
    await addSentencePlanMeeting(planId, meeting, tokens)
    return res.redirect(`${path.substring(0, path.lastIndexOf('/'))}#meetings`)
  } catch (error) {
    logger.error(`Could not save sentence plan meeting for plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { postAddMeeting, addMeetingValidationRules: validationRules }
