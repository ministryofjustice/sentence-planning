const getAddMeeting = async ({ path, errors, errorSummary, body }, res) => {
  const {
    'meeting-date-Day': meetingDateDay = '',
    'meeting-date-Month': meetingDateMonth = '',
    'meeting-date-Year': meetingDateYear = '',
  } = body
  return res.render(`${__dirname}/index`, {
    ...body,
    meetingDateDay,
    meetingDateMonth,
    meetingDateYear,
    errors,
    errorSummary,
    backurl: `${path.substring(0, path.lastIndexOf('/'))}#meetings`,
  })
}

module.exports = { getAddMeeting }
