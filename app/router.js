// Local dependencies
const { readFile } = require('fs')
const healthCheckFactory = require('../common/services/healthcheck')
const getOffenderDetails = require('../common/middleware/getOffenderDetails')
const { getObjectiveData } = require('../common/middleware/getObjectiveData')
const { getActionData } = require('../common/middleware/getActionData')
const { getActionTimelineData, getObjectiveTimelineData } = require('../common/middleware/getTimelineData')
const {
  apis: { sentencePlanning },
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
const activePlanUpdateActionRoute = `${activePlanObjectiveRoute}/update-action/:actionId(${uuid})`
const activePlanCloseObjectiveRoute = `${activePlanObjectiveRoute}/close`
const activePlanReorderActionRoute = `${activePlanObjectiveRoute}/reorder`
const activePlanDisplayMeetingRoute = `${activePlanRoute}/view-sentence-plan-meeting/:meetingId(${uuid})`
const activePlanAddMeetingRoute = `${activePlanRoute}/add-sentence-plan-meeting`

const logger = require('../common/logging/logger')

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
const { getCloseObjective } = require('./objectiveClose/get.controller')
const { postCloseObjective, closeObjectiveValidationRules } = require('./objectiveClose/post.controller')

const { getAction } = require('./action/get.controller')
const { postAction, actionValidationRules } = require('./action/post.controller')

const createSentencePlan = require('../common/middleware/createSentencePlan')
const { editPlan } = require('./editPlan/get.controller')

const { postStartPlan } = require('./startPlan/post.controller')
const { postEndPlan } = require('./endPlan/post.controller')

// active plan pages
const { getHomepage } = require('./activeplan/homepage/get.controller')
const { getMeeting } = require('./activeplan/homepage/displayMeeting/get.controller')
const { getAddMeeting } = require('./activeplan/homepage/addMeeting/get.controller')
const { postAddMeeting, addMeetingValidationRules } = require('./activeplan/homepage/addMeeting/post.controller')
const { getContactArrangements } = require('./activeplan/homepage/contactArrangements/get.controller')
const {
  postContactArrangements,
  contactArrangementsValidationRules,
} = require('./activeplan/homepage/contactArrangements/post.controller')
const { printFullSentencePlan } = require('./printing/printFull/get.controller')
const { printSimplifiedSentencePlan } = require('./printing/printSimplified/get.controller')
const { printLegacySentencePlan } = require('./printing/printLegacy/get.controller')

const { getActionUpdate } = require('./actionUpdate/get.controller')
const { postActionUpdate, actionUpdateValidationRules } = require('./actionUpdate/post.controller')

const { getActionReorder } = require('./actionReorder/get.controller')
const { postActionReorder, actionReorderValidationRules } = require('./actionReorder/post.controller')

const { getObjectiveView } = require('./objectiveView/get.controller')

// Export
module.exports = app => {
  app.get('/health', (req, res, next) => {
    const healthService = healthCheckFactory({ name: 'sentencePlanning', config: sentencePlanning })
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
  app.get([editObjectiveRoute, activePlanNewObjectiveRoute], getObjective)
  app.post([editObjectiveRoute, activePlanNewObjectiveRoute], objectiveValidationRules(), validate, postObjective)
  app.get(`${editObjectiveRoute}/review`, getObjectiveData, getObjectiveReview)
  app.get(activePlanCloseObjectiveRoute, getObjectiveData, getCloseObjective)
  app.post(activePlanCloseObjectiveRoute, closeObjectiveValidationRules(), validate, postCloseObjective)
  app.get(activePlanObjectiveRoute, getObjectiveData, getObjectiveTimelineData, getObjectiveView)

  // action reorder
  app.get(activePlanReorderActionRoute, getObjectiveData, getActionReorder)
  app.post(activePlanReorderActionRoute, actionReorderValidationRules(), validate, postActionReorder)

  // actions
  app.get([editActionRoute, activePlanNewActionRoute], getAction)
  app.post([editActionRoute, activePlanNewActionRoute], actionValidationRules(), validate, postAction)

  // action update
  app.get(activePlanUpdateActionRoute, getActionData, getActionTimelineData, getActionUpdate)
  app.post(
    activePlanUpdateActionRoute,
    actionUpdateValidationRules(),
    validate,
    postActionUpdate,
    getActionData,
    getActionTimelineData,
    getActionUpdate
  )

  // active plan homepage
  app.get(activePlanRoute, getHomepage)

  // sentence plan meetings
  app.get(activePlanDisplayMeetingRoute, getMeeting)
  app.get(activePlanAddMeetingRoute, getAddMeeting)
  app.post(activePlanAddMeetingRoute, addMeetingValidationRules(), validate, postAddMeeting)

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

  // printing
  app.get(`${activePlanRoute}/print-full-plan`, printFullSentencePlan)
  app.get(`${activePlanRoute}/print-plan`, printSimplifiedSentencePlan)
  app.get(`${offenderRoute}/previous-plan/:planId(${uuid})`, printLegacySentencePlan)

  // mock server endpoints
  const getFile = (directory, file, res) => {
    const path = `mockServer/${directory}/${file}.json`
    logger.debug(`apiMockServer requesting ${path}`)
    readFile(path, (err, sentencePlan) => {
      return err ? res.status(404).send(`Invalid path ${path}`) : res.send(JSON.parse(sentencePlan))
    })
  }

  app.get('/mock', (req, res) => res.send('sentence-planner-mock is UP'))
  app.get(/offenders\/(crn|oasysOffenderId)\/([\w]+)$/, (req, res) => {
    return getFile('convictData', req.params[1], res)
  })
  app.get('/offenders/:individualid/sentenceplans', (req, res) => {
    return getFile('sentencePlanSummary', req.params.individualid, res)
  })
  app.get('/offenders/:individualid/sentenceplans/:planId', (req, res) => {
    return getFile('oasysSentencePlans', req.params.planId, res)
  })
  app.post('/offenders/:individualid/sentenceplans', ({ params: { individualid } }, res) => {
    logger.info(`MockAPI creating NEW sentence plan with: ${individualid}`)
    return getFile('sentencePlans', individualid, res)
  })
  app.get('/sentenceplans/:planId', ({ params: { planId } }, res) => {
    logger.info(`MockAPI returning sentence plan with id: ${planId}}`)
    return getFile('sentencePlans', planId, res)
  })
  app.get('/sentenceplans/:planid/comments', (req, res) => {
    return getFile('sentencePlanComments', req.params.planid, res)
  })
  app.put('/sentenceplans/:planid/comments', (req, res) => {
    if (req.params.planid === 999) {
      res.sendStatus(400)
    } else {
      logger.debug(`MockAPI saving comment ${JSON.stringify(req.body)}`)
      res.sendStatus(200)
    }
  })
  app.get('/sentenceplans/:planid', (req, res) => {
    return getFile('sentencePlan', req.params.planid, res)
  })

  app.get('/sentenceplans/:planid/objectives', (req, res) => {
    return getFile('sentencePlanObjectives', req.params.planid, res)
  })

  app.get('/sentenceplans/:planid/objectives/:objectiveid', (req, res) => {
    return getFile('sentencePlanObjectives', req.params.objectiveid, res)
  })

  app.post('/sentenceplans/:planid/objectives', (req, res) => {
    logger.debug(`MockAPI saving new objective ${JSON.stringify(req.body)}`)
    return getFile('sentencePlanObjectives', '1', res)
  })

  app.put('/sentenceplans/:planid/objectives/:objectiveid', (req, res) => {
    if (req.params.objectiveid === 999) {
      res.sendStatus(400)
    }
    logger.debug(`MockAPI saving objective ${JSON.stringify(req.body)}`)
    return getFile('sentencePlanObjectives', req.params.objectiveid, res)
  })

  app.get('/sentenceplans/:planid/needs', (req, res) => {
    return getFile('sentencePlanNeeds', req.params.planid, res)
  })

  app.get('/sentenceplans/:planid/objectives/:objectiveid/actions/:actionId', (req, res) => {
    return getFile('sentencePlanActions', req.params.actionId, res)
  })

  app.post('/sentenceplans/:planid/objectives/:objectiveid/actions', (req, res) => {
    logger.debug(`MockAPI saving new action ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.post('/sentenceplans/:planid/objectives/:objectiveid/close', (req, res) => {
    logger.debug(`MockAPI closing objective ${req.params.objectiveid} - ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.put('/sentenceplans/:planid/objectives/:objectiveid/actions/:actionId', (req, res) => {
    if (req.params.actionId === 999) {
      res.sendStatus(400)
    }
    logger.debug(`MockAPI saving action ${JSON.stringify(req.body)}`)
    return getFile('sentencePlanActions', req.params.objectiveid, res)
  })

  app.post('/sentenceplans/:planid/objectives/:objectiveid/actions/:actionId/progress', (req, res) => {
    logger.debug(`MockAPI saving new action progress ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.get('/interventions', (req, res) => {
    return getFile('interventions', 'interventions', res)
  })

  app.get('/motivation', (req, res) => {
    return getFile('motivations', 'motivations', res)
  })

  app.get('/offenders/:id/reviews', (req, res) => {
    return getFile('sentencePlanMeetings/summary', req.params.id, res)
  })

  app.get('/offenders/:id/reviews/:meetingId', (req, res) => {
    return getFile('sentencePlanMeetings/minutes', req.params.meetingId, res)
  })

  app.post('/sentenceplans/:planid/reviews', (req, res) => {
    logger.debug(`MockAPI saving new meeting ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.post('/sentenceplans/:planid/objectives/:objectiveId/actions/priority', (req, res) => {
    logger.debug(`MockAPI saving new actions order ${JSON.stringify(req.body)}`)
    return res.sendStatus(200)
  })

  app.post('/sentenceplans/:planid/start', (req, res) => {
    logger.debug(`MockAPI starting plan ${req.params.planid}`)
    return res.sendStatus(200)
  })

  app.post('/sentenceplans/:planid/end', (req, res) => {
    logger.debug(`MockAPI ending plan ${req.params.planid}`)
    return res.sendStatus(200)
  })

  app.get('*', (req, res) => res.render('app/error', { error: '404, Page Not Found' }))
}
