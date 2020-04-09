const appInsights = require('applicationinsights')
const { applicationInsights } = require('../config')

const initApplicationInsights = () => {
  if (applicationInsights.disabled) {
    console.log('Application Insights disabled; disable flag set')
    return
  }

  if (applicationInsights.instrumentationKey === '') {
    console.log('Applciation Insights disabled; no instrumentation key set')
    return
  }

  appInsights
    .setup(applicationInsights.instrumentationKey)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .setInternalLogging(applicationInsights.internalLogging, true)
    .start()

  const roleName = process.env.npm_package_name
  appInsights.defaultClient.context.tags['ai.cloud.role'] = roleName

  console.log(`Application Insights enabled with role name '${roleName}'`)
}

module.exports = { initApplicationInsights }
