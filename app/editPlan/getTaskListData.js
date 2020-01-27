const NOT_STARTED = 'NOT STARTED'
const CANNOT_START_YET = 'CANNOT START YET'
const INCOMPLETE = 'INCOMPLETE'
const COMPLETED = 'COMPLETED'

const ADD_DETAILS = 'Add details'
const REVIEW_DETAILS = 'Review details'

const reviewComments = (comments, commentTypes) => {
  const statusCount = comments.filter(({ commentType }) => commentTypes.includes(commentType))
  let statusText = NOT_STARTED
  let complete = false
  let hrefText = ADD_DETAILS

  if (statusCount.length === 1) statusText = INCOMPLETE
  else if (statusCount.length >= 2) {
    statusText = COMPLETED
    complete = true
    hrefText = REVIEW_DETAILS
  }
  return { statusText, complete, hrefText }
}

const getAboutTheIndividual = ({ comments }, stub) => {
  return {
    heading: {
      text: 'Write about the individual',
    },
    items: [
      {
        text: 'Responsivity',
        href: `${stub}/diversity`,
        ...reviewComments(comments, ['YOUR_RESPONSIVITY', 'THEIR_RESPONSIVITY']),
      },
    ],
  }
}

const actionsComplete = (
  complete,
  { description = '', intervention = '', motivationUUID = '', updated = '', owner = [], ownerOther = '' }
) =>
  complete &&
  (description.length > 0 || intervention.length > 0) &&
  motivationUUID.length > 0 &&
  (updated === null || updated.length > 0) &&
  (owner.length > 0 || ownerOther.length > 0)
const getAddObjectives = ({ objectives = [] }, stub) => {
  const addedObjectives = objectives.map(({ actions = [], needs = [], description = '', id }, index) => {
    const addedObjective = {
      text: description.length > 0 ? description : `Add objective ${index + 1}`,
      hrefText: ADD_DETAILS,
      href: `${stub}/edit-objective/${id}`,
      statusText: INCOMPLETE,
      complete: false,
    }
    if (description.length === 0 && needs.length === 0) {
      addedObjective.statusText = NOT_STARTED
    } else if (description.length > 0 && actions.reduce(actionsComplete, true)) {
      addedObjective.statusText = COMPLETED
      addedObjective.complete = true
    }
    return addedObjective
  })

  const addAnotherObjective =
    addedObjectives.length === 1 && addedObjectives[addedObjectives.length - 1].statusText === NOT_STARTED
      ? {
          text: `Add objective 2`,
          hrefText: 'Add objective 1 first',
          statusText: CANNOT_START_YET,
          complete: false,
        }
      : {
          text: `Add objective ${addedObjectives.length + 1}`,
          hrefText: ADD_DETAILS,
          href: `${stub}/edit-objective/NEW`,
          statusText: NOT_STARTED,
          complete: false,
        }

  return {
    heading: {
      text: 'Add objectives',
      description: 'Each objective can have multiple actions.',
    },
    items: [...addedObjectives, addAnotherObjective],
  }
}
const getFinalInformation = ({ comments }, stub, hasObjective) => {
  const itemOptions = hasObjective
    ? reviewComments(comments, ['YOUR_SUMMARY', 'THEIR_SUMMARY'])
    : { hrefText: 'Add at least one objective first', statusText: CANNOT_START_YET, complete: false }
  return {
    heading: {
      text: 'Enter final information',
    },
    items: [
      {
        text: 'Decisions and comments',
        href: hasObjective ? `${stub}/decisions` : '',
        ...itemOptions,
      },
    ],
  }
}

module.exports = { getAboutTheIndividual, getAddObjectives, getFinalInformation }
