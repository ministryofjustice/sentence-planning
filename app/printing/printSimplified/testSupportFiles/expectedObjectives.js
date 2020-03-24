const sentencePlan = require('../../../../mockServer/sentencePlans/6.json')

let expectedObjectives = {
  active: [sentencePlan.objectives[0], sentencePlan.objectives[3]],
  future: [sentencePlan.objectives[1]],
  closed: [sentencePlan.objectives[2]],
}

expectedObjectives = JSON.stringify(expectedObjectives)
expectedObjectives = JSON.parse(expectedObjectives)
expectedObjectives.active[0].type = 'active'
expectedObjectives.active[0].actions[0].actionText = expectedObjectives.active[0].actions[0].description
expectedObjectives.active[0].actions[1].actionText = expectedObjectives.active[0].actions[1].description
expectedObjectives.active[0].actions[2].actionText = 'Intervention 2'
expectedObjectives.active[1].type = 'active'
expectedObjectives.active[1].actions[0].actionText = expectedObjectives.active[1].actions[0].description
expectedObjectives.active[1].actions[1].actionText = expectedObjectives.active[1].actions[1].description
expectedObjectives.active[1].actions[2].actionText = expectedObjectives.active[1].actions[2].description
expectedObjectives.future[0].type = 'future'
expectedObjectives.future[0].actions[0].actionText = expectedObjectives.future[0].actions[0].description
expectedObjectives.future[0].actions[1].actionText = expectedObjectives.future[0].actions[1].description
expectedObjectives.closed[0].type = 'closed'
expectedObjectives.closed[0].actions[0].actionText = expectedObjectives.closed[0].actions[0].description
expectedObjectives.closed[0].actions[1].actionText = expectedObjectives.closed[0].actions[1].description
expectedObjectives.closed[0].actions[2].actionText = expectedObjectives.closed[0].actions[2].description
expectedObjectives.active[0].actionsDisplay = [
  [
    {
      text: 'In progress action description text',
    },
    {
      format: 'numeric',
      text: 'August 2020',
    },
    {
      format: 'numeric',
      text: 'Doing it',
    },
  ],
  [
    {
      text: 'Completed action 2 description text',
    },
    {
      format: 'numeric',
      text: 'April 2020',
    },
    {
      format: 'numeric',
      text: 'Finished',
    },
  ],
  [
    {
      text: 'Intervention 2',
    },
    {
      format: 'numeric',
      text: 'December 2021',
    },
    {
      format: 'numeric',
      text: 'Not started',
    },
  ],
]
expectedObjectives.active[1].actionsDisplay = [
  [
    {
      text: 'Not started action description text',
    },
    {
      format: 'numeric',
      text: 'September 2022',
    },
    {
      format: 'numeric',
      text: 'Not started',
    },
  ],
  [
    {
      text: 'Completed action description text',
    },
    {
      format: 'numeric',
      text: 'March 2020',
    },
    {
      format: 'numeric',
      text: 'Finished',
    },
  ],
  [
    {
      text: 'Abandoned action description text',
    },
    {
      format: 'numeric',
      text: 'February 2021',
    },
    {
      format: 'numeric',
      text: 'Stopped',
    },
  ],
]
expectedObjectives.closed[0].actionsDisplay = [
  [
    {
      text: 'Completed action description text',
    },
    {
      format: 'numeric',
      text: 'January 2020',
    },
    {
      format: 'numeric',
      text: 'Finished',
    },
  ],
  [
    {
      text: 'Partially completed action 1 description text',
    },
    {
      format: 'numeric',
      text: 'February 2021',
    },
    {
      format: 'numeric',
      text: 'Did some',
    },
  ],
  [
    {
      text: 'Abandoned action description text',
    },
    {
      format: 'numeric',
      text: 'December 2020',
    },
    {
      format: 'numeric',
      text: 'Stopped',
    },
  ],
]
expectedObjectives.future[0].actionsDisplay = [
  [
    {
      text: 'Not started action 1 description text',
    },
    {
      format: 'numeric',
      text: 'November 2020',
    },
    {
      format: 'numeric',
      text: 'Not started',
    },
  ],
  [
    {
      text: 'Not started action 2 description text',
    },
    {
      format: 'numeric',
      text: 'April 2021',
    },
    {
      format: 'numeric',
      text: 'Not started',
    },
  ],
]

module.exports = { expectedObjectives }
