module.exports = {
  thisIsMe: {
    fields: [
      {
        offenderStatement: {
          responseType: 'optionalString',
          validationMessage: 'Please provide a statement from the offender.',
        },
      },
    ],
    validate: true,
  },
}
