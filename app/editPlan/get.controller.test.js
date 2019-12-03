const { editPlan } = require('./get.controller')
const { getSentencePlan } = require('../../common/data/sentencePlanningApi')
const { getAboutTheIndividual, getAddObjectives, getFinalInformation } = require('./getTaskListData')

jest.mock('../../common/data/sentencePlanningApi', () => ({
  getSentencePlan: jest.fn(),
}))
jest.mock('./getTaskListData')

describe('getSentencePlanSummary', () => {
  const path = 'the/long/and/winding.road'
  const sentencePlan = { value: 'sp' }
  const req = {
    path,
    params: {
      id: 1,
      planId: 2,
    },
    session: {
      'x-auth-token': '1234',
    },
  }
  const res = {
    render: jest.fn(),
  }
  afterEach(() => {
    res.render.mockReset()
    getAboutTheIndividual.mockReset()
    getAddObjectives.mockReset()
    getFinalInformation.mockReset()
  })

  describe('editPlan', () => {
    const completionStatus = true
    const aboutTheIndividualSection = { value: 'section 1' }
    const addObjectivesSection = { value: 'section 2', items: [{ complete: completionStatus }] }
    const finalInformationSection = { value: 'section 3' }
    const planSummary = { sections: [aboutTheIndividualSection, addObjectivesSection, finalInformationSection] }
    beforeEach(() => {
      getAboutTheIndividual.mockReturnValueOnce(aboutTheIndividualSection)
      getAddObjectives.mockReturnValueOnce(addObjectivesSection)
      getFinalInformation.mockReturnValueOnce(finalInformationSection)
    })
    describe('with a valid sentence plan', () => {
      beforeEach(async () => {
        getSentencePlan.mockReturnValueOnce(sentencePlan)
        await editPlan(req, res)
      })
      it('should generate the "About the individual" section', () => {
        expect(getAboutTheIndividual).toHaveBeenCalledWith(sentencePlan, path)
      })
      it('should generate the "Add objectives" section', () => {
        expect(getAddObjectives).toHaveBeenCalledWith(sentencePlan, path)
      })
      it('should generate the "Final information" section', () => {
        expect(getFinalInformation).toHaveBeenCalledWith(sentencePlan, path, completionStatus)
      })
      it('should set the correct render value', () => {
        const expected = { id: 1, token: '1234', planSummary }
        expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
      })
    })
    describe('on recieving an error', () => {
      const theError = new Error('Error message')
      beforeEach(() => {
        getSentencePlan.mockImplementation(() => {
          throw theError
        })
      })
      it('should render the error page', async () => {
        await editPlan(req, res)
        expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
      })
    })
  })
})
