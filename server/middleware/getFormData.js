const logger = require('../../log')

module.exports = formService => async (req, res, next) => {
  try {
    const formData = await formService.getFormResponse(res.locals.oasysOffenderId || req.params.id)

    res.locals.formObject = formData.form_response || {}
    res.locals.formId = formData.id

    next()
  } catch (error) {
    logger.warn(`Cannot retrieve form data. ${error}`)
    res.redirect('/')
  }
}
