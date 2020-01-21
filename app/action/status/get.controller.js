const getStatus = ({ status: actionStatus = '' }, { status: bodyStatus = '' }) => ({
  status: bodyStatus || actionStatus,
})

module.exports = { getStatus }
