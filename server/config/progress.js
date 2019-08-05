module.exports = {
  progress: {
    fields: [
      {
        progressStep: {
          responseType: 'requiredString',
          validationMessage: 'Select the current progress level',
        },
      },
      {
        comments: {
          responseType: 'optionalString',
        },
      },
    ],
    validate: true,
  },
}
