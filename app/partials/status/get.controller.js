const { STATUS_LIST } = require('../../../common/utils/constants')

const getStatus = ({ status: actionStatus = '' }, { status: bodyStatus = '' }, initial) => {
  const status = bodyStatus || actionStatus
  return {
    status,
    statusItems: STATUS_LIST.filter(({ initialStatus }) => !initial || initialStatus).map(({ text, value }) => ({
      text,
      value,
      checked: value === status,
    })),
  }
}

module.exports = { getStatus }
