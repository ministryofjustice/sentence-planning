// adds relevant user information to res.locals for use by nunjucks templates

module.exports = ({ session }, res, next) => {
  const { 'x-auth-username': username } = session
  if (!username) throw new Error('Username (x-auth-username) not found in session')
  res.locals.username = username
  next()
}
