const { serviceCheckFactory } = require('../data/healthcheck')

const service = (name, config) => {
  const check = serviceCheckFactory(name, config)
  return () =>
    check()
      .then(result => ({ name, status: 'ok', message: result }))
      .catch(err => ({ name, status: 'ERROR', message: err }))
}

module.exports = (...services) => {
  const checks = services.map(({ name, config }) => service(name, config))

  return callback =>
    Promise.all(checks.map(fn => fn())).then(checkResults => {
      const allOk = checkResults.every(item => item.status === 'ok')
      const result = {
        healthy: allOk,
        checks: checkResults.reduce(gatherCheckInfo, {}),
      }
      callback(null, addAppInfo(result))
    })
}

function gatherCheckInfo(total, currentValue) {
  return { ...total, [currentValue.name]: currentValue.message }
}

function addAppInfo(result) {
  const buildInformation = getBuild()
  const buildInfo = {
    uptime: process.uptime(),
    build: buildInformation,
    version: buildInformation && buildInformation.buildNumber,
  }

  return { ...result, ...buildInfo }
}

function getBuild() {
  try {
    // eslint-disable-next-line import/no-unresolved,global-require
    return require('../../build-info.json')
  } catch (ex) {
    return null
  }
}
