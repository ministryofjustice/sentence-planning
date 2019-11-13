// adds relevant user information to res.locals for use by nunjucks templates

module.exports = (req, res, next) => {
  const username = req.session['x-auth-name']
  if (!username) throw new Error('Username (x-auth-name) not found in session')
  res.locals.username = username
  next()
}
