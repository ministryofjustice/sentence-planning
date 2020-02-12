const { countWords, isEmptyObject, removeUrlLevels, sortObject, catchAndReThrowError, isValidDate } = require('./util')

const inputText = "There is a green hill far away - and I shouldn't tell you that really"

describe('should count words in text', () => {
  it('returns the correct number of words', () => {
    expect(countWords(inputText)).toEqual(14)
  })
})

describe('checks to see if an object is empty', () => {
  it('correctly recognises non-empty object', () => {
    const obj = { item: 'value', text: 'hello' }
    expect(isEmptyObject(obj)).toEqual(false)
  })
  it('correctly recognises empty objects', () => {
    expect(isEmptyObject({})).toEqual(true)
    expect(isEmptyObject()).toEqual(true)
    expect(isEmptyObject(null)).toEqual(true)
    expect(isEmptyObject(undefined)).toEqual(true)
  })
})

describe('removes appropriate number of levels from url', () => {
  it('removes 1 level', () => {
    const myUrl = 'levels/one/two/three/four'
    expect(removeUrlLevels(myUrl, 1)).toEqual('levels/one/two/three')
  })

  it('removes 3 levels', () => {
    const myUrl = 'levels/one/two/three/four'
    expect(removeUrlLevels(myUrl, 3)).toEqual('levels/one')
  })

  it('copes with being asked to remove too many levels', () => {
    const myUrl = 'levels/one/two/three/four'
    expect(removeUrlLevels(myUrl, 300)).toEqual('')
  })

  it('copes with being asked to remove no levels', () => {
    const myUrl = 'levels/one/two/three/four'
    expect(removeUrlLevels(myUrl, 0)).toEqual(myUrl)
  })

  it('copes with bad input for number of levels', () => {
    const myUrl = 'levels/one/two/three/four'
    expect(removeUrlLevels(myUrl, undefined)).toEqual(myUrl)
  })

  it('copes with missing parameter for number of levels', () => {
    const myUrl = 'levels/one/two/three/four'
    expect(removeUrlLevels(myUrl)).toEqual(myUrl)
  })
})

describe('sorts an object correctly', () => {
  let input
  beforeEach(() => {
    input = [
      { sortKey: 'a ', otherfield: 'qwer' },
      { sortKey: 'c ', otherfield: 'asdf' },
      { sortKey: 'b ', otherfield: 'zxcv' },
    ]
  })
  it('sorts object in ascending order', () => {
    const expected = [
      { sortKey: 'a ', otherfield: 'qwer' },
      { sortKey: 'b ', otherfield: 'zxcv' },
      { sortKey: 'c ', otherfield: 'asdf' },
    ]
    input.sort(sortObject('sortKey'))
    expect(input).toStrictEqual(expected)
  })
  it('sorts object in descending order', () => {
    const expected = [
      { sortKey: 'c ', otherfield: 'asdf' },
      { sortKey: 'b ', otherfield: 'zxcv' },
      { sortKey: 'a ', otherfield: 'qwer' },
    ]
    input.sort(sortObject('sortKey', 'desc'))
    expect(input).toStrictEqual(expected)
  })
  it('returns input if key field not present', () => {
    const expected = input
    input.sort(sortObject('notarealkey', 'desc'))
    expect(input).toStrictEqual(expected)
  })
})
describe('catchAndReThrowError', () => {
  const initialErrorMessage = 'error message 1'
  const initialError = new Error(initialErrorMessage)
  const secondaryErrorMessage = 'error message 2'
  const throwTheError = () => catchAndReThrowError(initialError, secondaryErrorMessage)
  it('should throw an Error', () => {
    expect(throwTheError).toThrow()
  })
  it('should concatenate the error message for the new error', () => {
    expect(throwTheError).toThrowError(`Error: ${initialErrorMessage} ${secondaryErrorMessage}`)
  })
})

describe('should check if date is valid', () => {
  it('likes a valid date input', () => {
    expect(isValidDate(1, 10, 2015)).toEqual(true)
  })
  it('returns false when an invalid date is input', () => {
    expect(isValidDate(31, 9, 2015)).toEqual(false)
    expect(isValidDate(29, 2, 2015)).toEqual(false)
  })
  it('return false when nonsense is put in', () => {
    expect(isValidDate('fish fingers', 'chips', 'peas')).toEqual(false)
  })
})
