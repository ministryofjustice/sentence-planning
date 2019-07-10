const { offenderNeeds } = require('../services/offenderNeedsService')
const logger = require('../../log')

module.exports = () => async (req, res, next) => {
  const {
    params: { idType, id: oasysOffenderId },
  } = req
  offenderNeeds(idType, oasysOffenderId, (err, needs = {}) => {
    if (err) {
      logger.warn(`Cannot retrive needs for ${idType} ${oasysOffenderId} ${err}`)
      return res.render('../views/pages/unknownRecord', { oasysOffenderId, idType })
    }
    res.locals.needs = needs
    return next()
  })
}
