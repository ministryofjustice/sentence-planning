const sentencePlan = require('../../../../mockServer/sentencePlans/6.json')

let expectedObjectives = {
  active: [sentencePlan.objectives[0], sentencePlan.objectives[3]],
  future: [sentencePlan.objectives[1]],
  closed: [sentencePlan.objectives[2]],
}

expectedObjectives = JSON.stringify(expectedObjectives)
expectedObjectives = JSON.parse(expectedObjectives)
expectedObjectives.active[0].type = 'active'
expectedObjectives.active[1].type = 'active'
expectedObjectives.future[0].type = 'future'
expectedObjectives.closed[0].type = 'closed'
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
      text: 'In progress',
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
      text: 'Completed',
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
      text: 'To do',
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
      text: 'Completed',
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
      text: 'Abandoned',
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
      text: 'Completed',
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
      text: 'Partially completed',
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
      text: 'Abandoned',
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
      text: 'To do',
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
      text: 'To do',
    },
  ],
]

module.exports = { expectedObjectives }
