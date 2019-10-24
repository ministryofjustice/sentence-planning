const uuid = require('uuid')
const cls = require('continuation-local-storage')

cls.createNamespace('uk.gov.digital.hmpps.sentence-planning')

function mdcSetup(req, res, next) {
  const MDC = {
    sessionId: req.sessionID,
    correlationId: uuid.v4(),
  }
  const mdcNamespace = cls.getNamespace('uk.gov.digital.hmpps.sentence-planning')
  mdcNamespace.bindEmitter(req)
  mdcNamespace.bindEmitter(res)
  mdcNamespace.run(() => {
    mdcNamespace.set('MDC', MDC)
    next()
  })
}

function getMdcForHeader() {
  const mdcNamespace = cls.getNamespace('uk.gov.digital.hmpps.sentence-planning')
  if (!mdcNamespace) {
    return {}
  }
  return mdcNamespace.get('MDC')
}

module.exports = { mdcSetup, getMdcForHeader }
