const appInsights = require("applicationinsights")
const { applicationInsights } = require("../config")

const initApplicationInsights = () => {
    if (applicationInsights.instrumentationKey === "") {
        console.log("Applciation Insights disabled; no instrumentation key set");
        return;
    }

    const debugLogging = applicationInsights.internalLogging in ["true", "1", "yes", "on"];
    appInsights.setup(applicationInsights.instrumentationKey)
            .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
            .setInternalLogging(debugLogging, true)
            .start();

    const roleName = process.env.npm_package_name;
    appInsights.defaultClient.context.tags["ai.cloud.role"] = roleName;

    console.log(`Application Insights enabled with role name '${roleName}'`);
}

module.exports = { initApplicationInsights };