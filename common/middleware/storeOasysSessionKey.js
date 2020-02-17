// adds OASys session key to session. This should then be passed as header X-Session-Id in each API call

module.exports = (req, res, next) => {
  const { sessionKey } = req.query
  if (sessionKey) {
    req.session.sessionKey = sessionKey
  }
  next()
}
