const { formatErrorSummary } = require('./formatErrorSummary')

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

describe('should format errors into correct form for rendering in template error summary', () => {
  it('should format errors', () => {
    const expected = [
      {
        href: '#diversity-error',
        text: 'Record how you will take account of diversity factors',
      },
      {
        href: '#needtoknow-error',
        text: 'Error message',
      },
    ]
    expect(formatErrorSummary(errors)).toEqual(expected)
  })
})
