const getResponsibility = (
  { owner: actionResponsibility = null, ownerOther: actionResponsibilityOther = '' },
  { responsibility: bodyResponsibility = null, responsibilityOther: bodyResponsibilityOther = '' }
) => ({
  responsibility: bodyResponsibility || actionResponsibility || [],
  responsibilityOther: bodyResponsibilityOther || actionResponsibilityOther,
})

module.exports = { getResponsibility }
