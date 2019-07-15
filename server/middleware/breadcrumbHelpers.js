const searchBreadcrumb = () => {
  return {
    text: 'Search',
    href: '/',
  }
}
const summaryBreadcrumb = (oasysOffenderId, forename1, familyName) => {
  return {
    text: `${forename1} ${familyName}`,
    href: `/offender-summary/oasys-offender-id/${oasysOffenderId}`,
  }
}
const sentencePlanBreadcrumb = (oasysOffenderId, sentencePlanId, sentencePlanDateCreated) => {
  return {
    text: `Sentence plan ${sentencePlanDateCreated}`,
    href: `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}`,
  }
}

module.exports = {
  searchBreadcrumb,
  summaryBreadcrumb,
  sentencePlanBreadcrumb,
}
