const uuid = require('uuid')
const cls = require('cls-hooked')
const { clsNamespace } = require('../config')

cls.createNamespace(clsNamespace)

function mdcSetup(req, res, next) {
  const MDC = {
    sessionId: req.sessionID,
    correlationId: uuid.v4(),
  }
  const mdcNamespace = cls.getNamespace(clsNamespace)
  mdcNamespace.bindEmitter(req)
  mdcNamespace.bindEmitter(res)
  mdcNamespace.run(() => {
    mdcNamespace.set('MDC', MDC)
    next()
  })
}

function getMdcForHeader() {
  const mdcNamespace = cls.getNamespace(clsNamespace)
  if (!mdcNamespace) {
    return {}
  }
  return mdcNamespace.get('MDC')
}

module.exports = { mdcSetup, getMdcForHeader }
