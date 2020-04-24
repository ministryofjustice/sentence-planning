const _ = require('lodash')
const { getNamespace } = require('cls-hooked')
const { clsNamespace } = require('../config')

module.exports = class {
  constructor(logger, MDC) {
    this.logger = logger
    this.MDC = MDC
  }

  debug(msg, meta) {
    this.logger.debug(msg, this.withMDC(meta))
  }

  error(msg, meta) {
    this.logger.error(msg, this.withMDC(meta))
  }

  info(msg, meta) {
    this.logger.info(msg, this.withMDC(meta))
  }

  silly(msg, meta) {
    this.logger.silly(msg, this.withMDC(meta))
  }

  verbose(msg, meta) {
    this.logger.verbose(msg, this.withMDC(meta))
  }

  warn(msg, meta) {
    this.logger.warn(msg, this.withMDC(meta))
  }

  log(level, msg, meta) {
    this.logger.log(level, msg, this.withMDC(meta))
  }

  // eslint-disable-next-line class-methods-use-this
  withMDC(meta) {
    const mdcNamespace = getNamespace(clsNamespace)
    if (!mdcNamespace) {
      return meta
    }
    if (meta) {
      return _.extend(meta, mdcNamespace.get('MDC'))
    }
    return mdcNamespace.get('MDC')
  }
}
