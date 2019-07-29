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

const sentencePlanChildrenBreadcrumbs = (
  oasysOffenderId,
  forename1,
  familyName,
  sentencePlanId,
  sentencePlanDateCreated
) => {
  const breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
  if (sentencePlanId !== 'new') {
    breadcrumbs.push(sentencePlanBreadcrumb(oasysOffenderId, sentencePlanId, sentencePlanDateCreated))
  }
  return breadcrumbs
}

module.exports = {
  searchBreadcrumb,
  summaryBreadcrumb,
  sentencePlanBreadcrumb,
  sentencePlanChildrenBreadcrumbs,
}
