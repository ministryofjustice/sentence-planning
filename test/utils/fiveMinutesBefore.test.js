const fiveMinutesBefore = require('../../server/utils/fiveMinutesBefore')

let realDateNow

beforeEach(() => {
  realDateNow = Date.now.bind(global.Date)
  const time = new Date('May 31, 2018 12:00:00')
  global.Date = jest.fn(() => time)
})

afterEach(() => {
  global.Date.now = realDateNow
})

describe('fiveMinutesBefore', () => {
  it('check', () => {
    const twentyMinutesInSeconds = 20 * 60
    const fifteenMinutesFromNow = new Date('May 31, 2018 12:15:00')
    expect(fiveMinutesBefore(twentyMinutesInSeconds)).toEqual(fifteenMinutesFromNow.getTime())
  })
})
