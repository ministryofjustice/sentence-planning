const {
  countWords,
  isEmptyObject,
  removeUrlLevels,
  sortObject,
  catchAndReThrowError,
  isValidDate,
  hasClosedStatus,
  getObjectiveType,
  formatObjectiveActionsForPrintDisplay,
  getActionText,
  encodeHTML,
} = require('./util')
const {
  ACTION_STATUS_TYPES: { COMPLETED, PARTIALLY_COMPLETED, NOT_STARTED, PAUSED, IN_PROGRESS, ABANDONED },
} = require('./constants')

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

describe('should check if a status is a closed one', () => {
  it('correctly determines a closed status', () => {
    expect(hasClosedStatus(COMPLETED)).toEqual(true)
    expect(hasClosedStatus(ABANDONED)).toEqual(true)
    expect(hasClosedStatus(PARTIALLY_COMPLETED)).toEqual(true)
    expect(hasClosedStatus(NOT_STARTED)).toEqual(false)
    expect(hasClosedStatus(PAUSED)).toEqual(false)
    expect(hasClosedStatus(IN_PROGRESS)).toEqual(false)
  })
})

describe('should return the correct type for an objective', () => {
  it('defaults to active', () => {
    const objective = {
      actions: [
        {
          status: 'IN_PROGRESS',
        },
        {
          status: 'nonsense',
        },
      ],
    }
    expect(getObjectiveType(objective)).toEqual('active')
  })
  it('correctly determines an active objective', () => {
    const objective = {
      actions: [
        {
          status: 'IN_PROGRESS',
        },
        {
          status: 'COMPLETED',
        },
      ],
    }
    expect(getObjectiveType(objective)).toEqual('active')
  })
  it('correctly determines a future objective', () => {
    const objective = {
      actions: [
        {
          status: 'NOT_STARTED',
        },
        {
          status: 'NOT_STARTED',
        },
      ],
    }
    expect(getObjectiveType(objective)).toEqual('future')
  })
  it('correctly determines a completed objective', () => {
    const objective = {
      actions: [
        {
          status: 'ABANDONED',
        },
        {
          status: 'COMPLETED',
        },
        {
          status: 'PARTIALLY_COMPLETED',
        },
      ],
    }
    expect(getObjectiveType(objective)).toEqual('closed')
  })
})

describe('should format actions so they can be displayed by the print template', () => {
  const actions = [
    {
      description: 'Not started action description text',
      status: 'NOT_STARTED',
      targetDate: '2022-09',
    },
    {
      description: 'Completed action description text',
      status: 'COMPLETED',
      targetDate: '2020-03',
    },
  ]

  it('returns actions in the correct format', () => {
    const expected = [
      [
        { text: 'Not started action description text' },
        { text: 'September 2022', format: 'numeric' },
        { text: 'To do', format: 'numeric' },
      ],
      [
        { text: 'Completed action description text' },
        { text: 'March 2020', format: 'numeric' },
        { text: 'Completed', format: 'numeric' },
      ],
    ]
    expect(formatObjectiveActionsForPrintDisplay(actions)).toEqual(expected)
  })

  it('returns actions in the correct format with simplified status text', () => {
    const expected = [
      [
        { text: 'Not started action description text' },
        { text: 'September 2022', format: 'numeric' },
        { text: 'Not started', format: 'numeric' },
      ],
      [
        { text: 'Completed action description text' },
        { text: 'March 2020', format: 'numeric' },
        { text: 'Finished', format: 'numeric' },
      ],
    ]
    expect(formatObjectiveActionsForPrintDisplay(actions, true)).toEqual(expected)
  })
})

describe('getActionText', () => {
  it('should return the intervention text if a UUID is present', () => {
    const uuid = '11111111-1111-1111-1111-111111111111'
    const shortDescription = 'Spoon'
    const interventionList = [{ uuid, shortDescription }]
    expect(getActionText({ intervention: uuid }, interventionList)).toEqual(shortDescription)
  })
  it('should return the description text if present', () => {
    const description = 'Dish'
    expect(getActionText({ description }, [])).toEqual(description)
  })
})

describe('encodeHTML', () => {
  it('should convert < > and quote characters to HTML encoded equivalents', () => {
    const inputString = '< > " \''
    expect(encodeHTML(inputString)).toEqual('&lt; &gt; &quot; &#039;')
  })

  it('should leave other text and existing encoded characters unchanged', () => {
    const inputString = '</textarea>&lt;&#x2F;textarea&gt;&lt;'
    expect(encodeHTML(inputString)).toEqual('&lt;/textarea&gt;&lt;&#x2F;textarea&gt;&lt;')
  })
})
