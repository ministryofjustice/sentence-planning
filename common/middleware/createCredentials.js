// makes a credentials object in req which we eventually use in our API calls

module.exports = (req, res, next) => {
  const {
    headers: { 'x-auth-token': authorisationToken = '' },
    session: { sessionKey = '' },
  } = req

  req.tokens = {
    authorisationToken,
    sessionKey,
  }
  next()
}
