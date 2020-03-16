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
      let expectedObjectives = JSON.stringify(oasysPlan)
      expectedObjectives = JSON.parse(expectedObjectives)
      const expected = {
        backUrl: 'lead/me/up/the/plans',
        legacyPlan: expectedObjectives,
      }
      expected.legacyPlan.questions = expectedQuestions
      getOasysSentencePlan.mockReturnValueOnce(oasysPlan)
      await printLegacySentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
    })

    it('should display an error if plan is not available', async () => {
      const theError = new Error('Error message')
      getOasysSentencePlan.mockImplementation(() => {
        throw theError
      })
      await printLegacySentencePlan(req, res)
      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
