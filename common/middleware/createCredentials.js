// makes a credentials object in req which we eventually use in our API calls

module.exports = (req, res, next) => {
  const {
    headers: { 'x-auth-token': authorisationToken = '' },
  } = req

  req.tokens = {
    authorisationToken,
  }
  next()
}
