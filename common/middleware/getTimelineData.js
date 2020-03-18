const { RESPONSIBLE_LIST, STATUS_LIST } = require('../../common/utils/constants')

const appendActionCreated = (timelineData, created, description) =>
  created && timelineData.push({ type: 'Action Created', created, description })

const getOwnerString = owner => {
  if (!owner) return ''
  return owner.reduce((last, ownerItem) => {
    return `${last}${last.length > 0 ? ', ' : ''}${RESPONSIBLE_LIST.find(({ value }) => value === ownerItem).text}`
  }, '')
}

const processProgress = (progress = [], motivationList, description = '') => {
  return progress
    .map(
      ({
        comment,
        created = '',
        createdBy = '',
        motivationUUID = '',
        status = '',
        targetDate = '',
        owner = '',
        ownerOther = '',
      }) => {
        const ownerText = owner ? getOwnerString(owner) : ''
        const statusText = status ? STATUS_LIST.find(({ value }) => value === status).text : ''
        const motivationText = motivationUUID ? motivationList.find(({ value }) => value === motivationUUID).text : ''
        return {
          type: 'Action Updated',
          created,
          createdBy,
          description,
          data: [
            { key: 'Status', value: statusText },
            { key: 'Target date', value: targetDate },
            { key: 'Motivation', value: motivationText },
            { key: 'Owner', value: ownerText },
            { key: 'Owner other', value: ownerOther },
            { key: 'Comment', value: comment },
          ].filter(({ value }) => value),
        }
      }
    )
    .reverse()
}

const processAction = ({ progress, created, description = '' }, motivationList, hideActionDescription = false) => {
  const descriptionText = hideActionDescription ? '' : description
  const timelineData = processProgress(progress, motivationList, descriptionText)
  appendActionCreated(timelineData, created, descriptionText)
  return timelineData
}

const processStatusChanges = statusChanges =>
  statusChanges.map(({ status, comment, created, createdBy }) => ({
    type: 'Objective Updated',
    created,
    createdBy,
    data: [
      { key: 'Status', value: status },
      { key: 'Comment', value: comment },
    ],
  }))

const getActionTimelineData = (req, _res, next) => {
  const { action, renderInfo = {}, motivationList } = req
  req.renderInfo = Object.assign(renderInfo, { timelineData: processAction(action, motivationList, true) })
  next()
}

const getObjectiveTimelineData = (req, res, next) => {
  const {
    objective: { actions, statusChanges, created, createdBy },
    renderInfo = {},
    motivationList,
  } = req
  const timelineData = actions.reduce((timeline, action) => timeline.concat(processAction(action, motivationList)), [])
  timelineData.push({ type: 'Objective Created', created, createdBy }, ...processStatusChanges(statusChanges))
  timelineData.sort(({ created: createdA = 0 }, { created: createdB = 0 }) => new Date(createdA) < new Date(createdB))
  req.renderInfo = Object.assign(renderInfo, { timelineData })
  next()
}

module.exports = {
  processStatusChanges,
  getObjectiveTimelineData,
  getActionTimelineData,
  processProgress,
  processAction,
  appendActionCreated,
  getOwnerString,
}
