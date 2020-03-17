const { printLegacySentencePlan } = require('./get.controller')
const { getOasysSentencePlan } = require('../../../common/data/sentencePlanningApi')

jest.mock('../../../common/data/sentencePlanningApi')

const tokens = { authorisationToken: 'mytoken' }
let oasysPlan

describe('displayOasysSentencePlan', () => {
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
    getOasysSentencePlan.mockReset()
    oasysPlan = {
      oasysSetId: 9465346,
      createdDate: '2020-03-06T09:12:51',
      objectives: [
        {
          objectiveData: 'blah blah',
        },
      ],
      questions: {
        'IP.29': {
          refQuestionId: 1621,
        },
        'IP.1': {
          refQuestionId: 1603,
        },
      },
    }
  })

  describe('show OASys plan', () => {
    it('should set the correct render values when getting a full sentence plan', async () => {
      const expectedQuestions = [
        {
          refQuestionId: 1621,
        },
        {
          refQuestionId: 1603,
        },
      ]
      let planCopy = JSON.stringify(oasysPlan)
      planCopy = JSON.parse(planCopy)
      planCopy.questions = expectedQuestions
      const expected = {
        backUrl: 'lead/me/up/the/plans',
        legacyPlan: planCopy,
      }
      getOasysSentencePlan.mockReturnValueOnce(oasysPlan)
      await printLegacySentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })

    it('should display an error if plan is not available', async () => {
      const theError = new Error('API error')
      getOasysSentencePlan.mockImplementation(() => {
        throw theError
      })
      const expectedError = new Error(['An error occurred whilst trying to display the sentence plan. Error: API error'])
      await printLegacySentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { "error": expectedError })
    })
  })
})
