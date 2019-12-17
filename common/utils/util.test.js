const { countWords, isEmptyObject, removeUrlLevels } = require('./util')

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
