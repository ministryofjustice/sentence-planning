const COMMENT_TYPES = {
  YOUR_RESPONSIVITY: 'YOUR_RESPONSIVITY',
  YOUR_SUMMARY: 'YOUR_SUMMARY',
  THEIR_RESPONSIVITY: 'THEIR_RESPONSIVITY',
  THEIR_SUMMARY: 'THEIR_SUMMARY',
  LIAISON_ARRANGEMENTS: 'LIAISON_ARRANGEMENTS',
}

const ACTION_STATUS_TYPES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED',
  ABANDONED: 'ABANDONED',
}

const ACTION_RESPONSIBLE_TYPES = {
  SERVICE_USER: 'SERVICE_USER',
  PRACTITIONER: 'PRACTITIONER',
  OTHER: 'OTHER',
}

const STATUS_LIST = [
  { simplifiedText: 'Not started', text: 'To do', value: ACTION_STATUS_TYPES.NOT_STARTED, initialStatus: true },
  { simplifiedText: 'Doing it', text: 'In progress', value: ACTION_STATUS_TYPES.IN_PROGRESS, initialStatus: true },
  { simplifiedText: 'Paused', text: 'Paused', value: ACTION_STATUS_TYPES.PAUSED },
  { simplifiedText: 'Finished', text: 'Completed', value: ACTION_STATUS_TYPES.COMPLETED },
  { simplifiedText: 'Did some', text: 'Partially completed', value: ACTION_STATUS_TYPES.PARTIALLY_COMPLETED },
  { simplifiedText: 'Stopped', text: 'Abandoned', value: ACTION_STATUS_TYPES.ABANDONED },
]

const RESPONSIBLE_LIST = [
  { text: 'Individual', value: ACTION_RESPONSIBLE_TYPES.SERVICE_USER },
  { text: 'Offender manager', value: ACTION_RESPONSIBLE_TYPES.PRACTITIONER },
  { text: 'Other', value: ACTION_RESPONSIBLE_TYPES.OTHER },
]

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const OBJECTIVE_TYPES = {
  ACTIVE: 'active',
  FUTURE: 'future',
  CLOSED: 'closed',
}

const PLAN_TYPES = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  NONE: 'none',
}

const RISK = {
  L: 'Low',
  M: 'Medium',
  H: 'High',
  V: 'Very high',
  NC: 'Not Calculated',
  N: 'None',
}

module.exports = Object.freeze({
  COMMENT_TYPES,
  ACTION_STATUS_TYPES,
  ACTION_RESPONSIBLE_TYPES,
  STATUS_LIST,
  RESPONSIBLE_LIST,
  UUID_REGEX,
  OBJECTIVE_TYPES,
  PLAN_TYPES,
  RISK,
})
