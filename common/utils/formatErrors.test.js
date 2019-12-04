const { formatErrors } = require('./formatErrors')

const errors = [
  {
    value: '',
    msg: 'Record how you will take account of diversity factors',
    param: 'diversity',
    location: 'body',
  },
  {
    value: 'My field value',
    msg: 'Error message',
    param: 'needtoknow',
    location: 'body',
  },
]

describe('should format errors into correct form for rendering in templates', () => {
  it('should format errors', () => {
    const expected = {
      diversity: {
        text: 'Record how you will take account of diversity factors',
      },
      needtoknow: {
        text: 'Error message',
      },
    }
    expect(formatErrors(errors)).toEqual(expected)
  })
})
