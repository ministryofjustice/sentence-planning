// adds relevant user information to res.locals for use by nunjucks templates

module.exports = ({ session }, res, next) => {
  const { 'X-Auth-Name': username } = session
  if (!username) throw new Error('Username (X-Auth-Name) not found in session')
  res.locals.username = username
  next()
}
