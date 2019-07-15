module.exports = {
  step: {
    fields: [
      {
        needs: {
          responseType: 'requiredArrayOfStrings',
          validationMessage: 'One or more needs must be selected',
        },
      },
      {
        intervention: {
          responseType: 'optionalString',
        },
      },
      {
        strength: {
          responseType: 'optionalString',
        },
      },
      {
        step: {
          responseType: 'requiredString',
          validationMessage: 'Add a description of the action',
        },
      },
      {
        owner: {
          responseType: 'requiredString',
          validationMessage: 'Select the actions owner',
        },
      },
    ],
    validate: true,
  },
}
