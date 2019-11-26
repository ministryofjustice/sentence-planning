const editPlan = async ({ params: { id }, session: { 'x-auth-token': token } }, res) => {
  res.render(`${__dirname}/index`, { id, token })
}

module.exports = { editPlan }
