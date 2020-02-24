const { printSimplifiedSentencePlan } = require('./get.controller')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi')

const tokens = { authorisationToken: 'mytoken' }
const sentencePlanEmpty = {}
const sentencePlan = require('../../../mockServer/sentencePlans/6.json')

describe('printFullSentencePlan', () => {
  const req = {
    path: 'lead/me/up/the/garden/path',
    params: {
      id: 1,
      planId: 6,
    },
    tokens,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    getSentencePlan.mockReset()
  })

  describe('show print page', () => {
    it('should set the correct render values when getting a full sentence plan', async () => {
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
      const expected = {
        backUrl: 'lead/me/up/the/garden',
        objectives: expectedObjectives,
      }
      getSentencePlan.mockReturnValueOnce(sentencePlan)
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })
    it('should pass in the correct values to the render function when plan is empty', async () => {
      getSentencePlan.mockReturnValueOnce(sentencePlanEmpty)
      const expected = {
        backUrl: 'lead/me/up/the/garden',
        objectives: {},
      }
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })

    it('should display an error if plan is not available', async () => {
      const theError = new Error('Error message')
      getSentencePlan.mockImplementation(() => {
        throw theError
      })
      await printSimplifiedSentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
