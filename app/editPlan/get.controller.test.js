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
    headers: {
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
    const incompleteStatus = false
    const completionStatus = true
    const aboutTheIndividualSection = { value: 'section 1' }
    const addObjectivesSection = { value: 'section 2', items: [{ complete: completionStatus }] }
    const finalInformationSection = { value: 'section 3', items: [{ complete: completionStatus }] }
    const finalInformationSectionIncomplete = { value: 'section 3', items: [{ complete: incompleteStatus }] }
    const planSummary = { sections: [aboutTheIndividualSection, addObjectivesSection, finalInformationSection] }
    const planSummaryIncomplete = {
      sections: [aboutTheIndividualSection, addObjectivesSection, finalInformationSectionIncomplete],
    }
    describe('with a valid sentence plan', () => {
      beforeEach(async () => {
        getAboutTheIndividual.mockReturnValueOnce(aboutTheIndividualSection)
        getAddObjectives.mockReturnValueOnce(addObjectivesSection)
        getFinalInformation.mockReturnValueOnce(finalInformationSection)
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
        const expected = { planId: 2, id: 1, token: '1234', planSummary, disableStartButton: false }
        expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
      })
    })
    describe('with an incomplete sentence plan', () => {
      beforeEach(async () => {
        getAboutTheIndividual.mockReturnValueOnce(aboutTheIndividualSection)
        getAddObjectives.mockReturnValueOnce(addObjectivesSection)
        getFinalInformation.mockReturnValueOnce(finalInformationSectionIncomplete)
        getSentencePlan.mockReturnValueOnce(sentencePlan)
        await editPlan(req, res)
      })
      it('should set the correct render value when draft plan is incomplete', () => {
        const expected = {
          planId: 2,
          id: 1,
          token: '1234',
          planSummary: planSummaryIncomplete,
          disableStartButton: true,
        }
        expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
      })
    })
    describe('on receiving an error', () => {
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
