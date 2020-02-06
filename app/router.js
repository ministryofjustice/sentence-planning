// Local dependencies
const healthCheckFactory = require('../common/services/healthcheck')
const getOffenderDetails = require('../common/middleware/getOffenderDetails')
const { getObjectiveData } = require('../common/middleware/getObjectiveData')
const {
  apis: { oauth2, offenderAssessment, sentencePlanning, elite2 },
} = require('../common/config')

const uuid = '[0-9a-f-]{1,}'
const uuidOrNewId = `${uuid}|NEW`
const offenderRoute = `/individual-id/:id(\\d{1,})`
const editPlanRoute = `${offenderRoute}/edit-plan/:planId(${uuid})`
const activePlanRoute = `${offenderRoute}/plan/:planId(${uuid})`
const editObjectiveRoute = `${editPlanRoute}/edit-objective/:objectiveId(${uuidOrNewId})`
const editActionRoute = `${editPlanRoute}/edit-objective/:objectiveId(${uuid})/edit-action/:actionId(${uuidOrNewId})`
const activePlanObjectiveRoute = `${activePlanRoute}/objective/:objectiveId(${uuid})`
const activePlanNewObjectiveRoute = `${activePlanRoute}/edit-objective/:objectiveId(NEW)`
const activePlanNewActionRoute = `${activePlanObjectiveRoute}/edit-action/:actionId(NEW)`

const { validate } = require('../common/middleware/validator')

// pages
const { sentencePlanSummary } = require('./plans/get.controller')

const { getDiversity } = require('./diversity/get.controller')
const { postDiversity, diversityValidationRules } = require('./diversity/post.controller')

const { getNeedToKnow } = require('./needToKnow/get.controller')
const { postNeedToKnow, needToKnowValidationRules } = require('./needToKnow/post.controller')

const { getDecisions } = require('./decisions/get.controller')
const { postDecisions, decisionsValidationRules } = require('./decisions/post.controller')

const { getComments } = require('./comments/get.controller')
const { postComments, commentsValidationRules } = require('./comments/post.controller')

const { getObjective } = require('./objective/get.controller')
const { postObjective, objectiveValidationRules } = require('./objective/post.controller')
const { getObjectiveReview } = require('./objectiveReview/get.controller')

const { getAction } = require('./action/get.controller')
const { postAction, actionValidationRules } = require('./action/post.controller')

const createSentencePlan = require('../common/middleware/createSentencePlan')
const { editPlan } = require('./editPlan/get.controller')

const { postStartPlan } = require('./startPlan/post.controller')
const { postEndPlan } = require('./endPlan/post.controller')

// active plan pages
const { getHomepage } = require('./activeplan/homepage/get.controller')
const { getMeeting } = require('./activeplan/homepage/meetings/get.controller')
const { getContactArrangements } = require('./activeplan/homepage/contactArrangements/get.controller')
const {
  postContactArrangements,
  contactArrangementsValidationRules,
} = require('./activeplan/homepage/contactArrangements/post.controller')

const { getObjectiveView } = require('./objectiveView/get.controller')

// Export
module.exports = app => {
  app.get('/health', (req, res, next) => {
    const healthService = healthCheckFactory(oauth2, offenderAssessment, sentencePlanning, elite2)
    healthService((err, result) => {
      if (err) {
        return next(err)
      }
      if (!result.healthy) {
        res.status(503)
      }
      res.json(result)
      return result
    })
  })

  app.use(offenderRoute, getOffenderDetails)
  app.get(`${offenderRoute}/plans`, (req, res) => sentencePlanSummary(req, res))

  // sentence plans summary
  app.get([offenderRoute, `${offenderRoute}/plans`], sentencePlanSummary)

  // diversity
  app.get(`${editPlanRoute}/diversity`, getDiversity)
  app.post(`${editPlanRoute}/diversity`, diversityValidationRules(), validate, postDiversity)

  // need to know
  app.get(`${editPlanRoute}/need-to-know`, getNeedToKnow)
  app.post(`${editPlanRoute}/need-to-know`, needToKnowValidationRules(), validate, postNeedToKnow)

  // decisions
  app.get(`${editPlanRoute}/decisions`, getDecisions)
  app.post(`${editPlanRoute}/decisions`, decisionsValidationRules(), validate, postDecisions)

  // comments
  app.get(`${editPlanRoute}/comments`, getComments)
  app.post(`${editPlanRoute}/comments`, commentsValidationRules(), validate, postComments)

  // objective
  app.get(editObjectiveRoute, getObjective)
  app.post(editObjectiveRoute, objectiveValidationRules(), validate, postObjective)
  app.get(`${editObjectiveRoute}/review`, getObjectiveData, getObjectiveReview)
  app.get(activePlanObjectiveRoute, getObjectiveData, getObjectiveView)
  app.get(activePlanNewObjectiveRoute, getObjective)
  app.post(activePlanNewObjectiveRoute, objectiveValidationRules(), validate, postObjective)

  // actions
  app.get(editActionRoute, getAction)
  app.post(editActionRoute, actionValidationRules(), validate, postAction)

  // active plan homepage
  app.get(activePlanRoute, getHomepage)

  // sentence plan meetings
  app.get(`${activePlanRoute}/view-sentence-plan-meeting/:meetingId(${uuid})`, getMeeting)

  app.use(offenderRoute, getOffenderDetails)
  app.get([offenderRoute, `${offenderRoute}/plans`], sentencePlanSummary)
  app.get(`${offenderRoute}/edit-plan/new`, createSentencePlan)
  app.get(editPlanRoute, editPlan)

  // edit contact arrangements
  app.get(`${activePlanRoute}/contact-arrangements`, getContactArrangements)
  app.post(
    `${activePlanRoute}/contact-arrangements`,
    contactArrangementsValidationRules(),
    validate,
    postContactArrangements
  )

  // start plan
  app.get(`${editPlanRoute}/start-plan`, ({ params: { planId, id } }, res) => {
    res.render('app/startPlan/index', { planId, id })
  })
  app.post(`${editPlanRoute}/start-plan`, postStartPlan)

  // end plan
  app.get(`${activePlanRoute}/end-plan`, ({ params: { planId, id } }, res) => {
    res.render('app/endPlan/index', { planId, id })
  })
  app.post(`${activePlanRoute}/end-plan`, postEndPlan)

  // outstanding pages still to be developed
  app.get(
    [
      `${activePlanRoute}/print-full`,
      `${activePlanRoute}/print-simple`,
      `${activePlanRoute}/sentence-board-meeting`,
      `${activePlanRoute}/objective/*`,
      activePlanNewActionRoute,
    ],
    (req, res) => res.send('Functionality still to be developed')
  )

  app.get('*', (req, res) => res.render('app/error', { error: '404, Page Not Found' }))
}
