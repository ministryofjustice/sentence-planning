const { getAboutTheIndividual, getAddObjectives, getFinalInformation } = require('./getTaskListData')

const NOT_STARTED = 'NOT STARTED'
const CANNOT_START_YET = 'CANNOT START YET'
const INCOMPLETE = 'INCOMPLETE'
const COMPLETED = 'COMPLETED'
const ADD_DETAILS = 'Add details'
const REVIEW_DETAILS = 'Review details'

const stub = '/major/tom'

describe('getAboutTheIndividual', () => {
  let expected
  let item
  beforeEach(() => {
    item = {
      text: 'Responsivity',
      href: `${stub}/diversity`,
      statusText: NOT_STARTED,
      complete: false,
      hrefText: ADD_DETAILS,
    }
    expected = {
      heading: {
        text: 'Write about the individual',
      },
      items: [item],
    }
  })
  describe('with no "YOUR_RESPONSIVITY", "THEIR_RESPONSIVITY"', () => {
    it('should return a "NOT_STARTED" state', () => {
      const sentencePlan = { comments: [] }
      expect(getAboutTheIndividual(sentencePlan, stub)).toEqual(expected)
    })
  })
  describe('with only one of "YOUR_RESPONSIVITY" or "THEIR_RESPONSIVITY"', () => {
    it('should return a "NOT_STARTED" state', () => {
      const sentencePlan = {
        comments: [
          {
            comment: 'bacon bacon bacon',
            commentType: 'YOUR_RESPONSIVITY',
            created: '2019-12-03T11:54:14.670Z',
            createdBy: 'string',
          },
        ],
      }
      item.statusText = INCOMPLETE
      expect(getAboutTheIndividual(sentencePlan, stub)).toEqual(expected)
    })
  })
  describe('with both "YOUR_RESPONSIVITY" and "THEIR_RESPONSIVITY" filled in', () => {
    it('should return a "COMPLETED" state', () => {
      const sentencePlan = {
        comments: [
          {
            comment: 'a',
            commentType: 'YOUR_RESPONSIVITY',
            created: '2019-12-03T11:54:14.670Z',
            createdBy: 'string',
          },
          {
            comment: 'b',
            commentType: 'THEIR_RESPONSIVITY',
            created: '2019-12-03T11:54:14.670Z',
            createdBy: 'string',
          },
        ],
      }
      item.statusText = COMPLETED
      item.complete = true
      item.hrefText = REVIEW_DETAILS
      expect(getAboutTheIndividual(sentencePlan, stub)).toEqual(expected)
    })
  })
})

describe('getAddObjectives', () => {
  describe('with no objectives', () => {
    it('should return an active "add objective" link', () => {
      const sentencePlan = {
        objectives: [],
      }
      const expected = {
        heading: {
          text: 'Add objectives',
          description: 'Each objective can have multiple actions.',
        },
        items: [
          {
            text: 'Add objective 1',
            href: '/major/tom/edit-objective/NEW',
            statusText: 'NOT STARTED',
            complete: false,
            hrefText: 'Add details',
          },
        ],
      }
      expect(getAddObjectives(sentencePlan, stub)).toEqual(expected)
    })
  })
  describe('with one objective', () => {
    describe('that is not started', () => {
      it('should return an active "add objective" link', () => {
        const expected = {
          heading: { text: 'Add objectives', description: 'Each objective can have multiple actions.' },
          items: [
            {
              text: 'Add objective 1',
              href: '/major/tom/edit-objective/123',
              statusText: 'NOT STARTED',
              complete: false,
              hrefText: 'Add details',
            },
            {
              complete: false,
              hrefText: 'Add objective 1 first',
              statusText: 'CANNOT START YET',
              text: 'Add objective 2',
            },
          ],
        }
        expect(getAddObjectives({ objectives: [{ id: '123' }] }, stub)).toEqual(expected)
      })
    })
    describe('that is partially complete', () => {
      it('should display an incomplete objective and an active "add objective" link', () => {
        const sentencePlan = {
          objectives: [
            {
              actions: [
                {
                  description: 'string',
                  id: 'string',
                  motivationUUID: 'string',
                  owner: ['SERVICE_USER'],
                  priority: 0,
                  progress: [],
                  status: 'NOT_STARTED',
                  updated: '2019-12-04T15:33:28.545Z',
                },
              ],
              description: 'This is a very interesting objective',
              id: '123',
              needs: [],
            },
          ],
        }
        const expected = {
          heading: { text: 'Add objectives', description: 'Each objective can have multiple actions.' },
          items: [
            {
              text: 'This is a very interesting objective',
              href: '/major/tom/edit-objective/123',
              statusText: 'INCOMPLETE',
              complete: false,
              hrefText: 'Add details',
            },
            {
              complete: false,
              href: '/major/tom/edit-objective/NEW',
              hrefText: 'Add details',
              statusText: 'NOT STARTED',
              text: 'Add objective 2',
            },
          ],
        }
        expect(getAddObjectives(sentencePlan, stub)).toEqual(expected)
      })
    })
    describe('that is complete', () => {
      it('should display a complete objective and an active "add objective" link', () => {
        const sentencePlan = {
          objectives: [
            {
              actions: [
                {
                  description: 'string',
                  id: 'string',
                  motivationUUID: 'string',
                  owner: ['SERVICE_USER'],
                  priority: 0,
                  progress: [],
                  status: 'NOT_STARTED',
                  updated: '2019-12-04T15:33:28.545Z',
                },
              ],
              description: 'This is a very interesting objective',
              id: '123',
              needs: ['care'],
            },
          ],
        }
        const expected = {
          heading: { text: 'Add objectives', description: 'Each objective can have multiple actions.' },
          items: [
            {
              text: 'This is a very interesting objective',
              href: '/major/tom/edit-objective/123',
              statusText: 'COMPLETED',
              complete: true,
              hrefText: 'Add details',
            },
            {
              complete: false,
              href: '/major/tom/edit-objective/NEW',
              hrefText: 'Add details',
              statusText: 'NOT STARTED',
              text: 'Add objective 2',
            },
          ],
        }
        expect(getAddObjectives(sentencePlan, stub)).toEqual(expected)
      })
    })
    describe('and more objectives', () => {
      it('should display multiple objectives and an active "add objective" link', () => {
        const sentencePlan = {
          objectives: [
            {
              actions: [
                {
                  description: 'string',
                  id: 'string',
                  motivationUUID: 'string',
                  owner: ['SERVICE_USER'],
                  priority: 0,
                  progress: [],
                  status: 'NOT_STARTED',
                  updated: '2019-12-04T15:33:28.545Z',
                },
              ],
              description: 'This is a very interesting objective',
              id: '123',
              needs: ['care'],
            },
            {
              actions: [
                {
                  description: 'string',
                  id: 'string',
                  motivationUUID: 'string',
                  owner: ['SERVICE_USER'],
                  priority: 0,
                  progress: [],
                  status: 'NOT_STARTED',
                  updated: '2019-12-04T15:33:28.545Z',
                },
              ],
              description: 'This is a very interesting objective',
              id: '123',
              needs: ['care'],
            },
          ],
        }
        const expected = {
          heading: { text: 'Add objectives', description: 'Each objective can have multiple actions.' },
          items: [
            {
              text: 'This is a very interesting objective',
              href: '/major/tom/edit-objective/123',
              statusText: 'COMPLETED',
              complete: true,
              hrefText: 'Add details',
            },
            {
              text: 'This is a very interesting objective',
              href: '/major/tom/edit-objective/123',
              statusText: 'COMPLETED',
              complete: true,
              hrefText: 'Add details',
            },
            {
              complete: false,
              href: '/major/tom/edit-objective/NEW',
              hrefText: 'Add details',
              statusText: 'NOT STARTED',
              text: 'Add objective 3',
            },
          ],
        }
        expect(getAddObjectives(sentencePlan, stub)).toEqual(expected)
      })
    })
  })
})

describe('getFinalInformation', () => {
  let expected
  let item
  const COMPLETE_OBJECTIVE = true
  const INCOMPLETE_OBJECTIVE = false
  beforeEach(() => {
    item = {
      text: 'Decisions and comments',
      href: `${stub}/decisions`,
      statusText: NOT_STARTED,
      complete: false,
      hrefText: ADD_DETAILS,
    }
    expected = {
      heading: {
        text: 'Enter final information',
      },
      items: [item],
    }
  })
  describe('with an objective completed', () => {
    describe('with no "YOUR_SUMMARY", "THEIR_SUMMARY"', () => {
      it('should return a "NOT_STARTED" state', () => {
        const sentencePlan = { comments: [] }
        expect(getFinalInformation(sentencePlan, stub, COMPLETE_OBJECTIVE)).toEqual(expected)
      })
    })
    describe('with only one of "YOUR_SUMMARY" or "THEIR_SUMMARY"', () => {
      it('should return a "NOT_STARTED" state', () => {
        const sentencePlan = {
          comments: [
            {
              comment: 'bacon bacon bacon',
              commentType: 'YOUR_SUMMARY',
              created: '2019-12-03T11:54:14.670Z',
              createdBy: 'string',
            },
          ],
        }
        expected.items[0].statusText = INCOMPLETE
        expect(getFinalInformation(sentencePlan, stub, COMPLETE_OBJECTIVE)).toEqual(expected)
      })
    })
    describe('with both "YOUR_SUMMARY" and "THEIR_SUMMARY" filled in', () => {
      it('should return a "COMPLETED" state', () => {
        const sentencePlan = {
          comments: [
            {
              comment: 'a',
              commentType: 'YOUR_SUMMARY',
              created: '2019-12-03T11:54:14.670Z',
              createdBy: 'string',
            },
            {
              comment: 'b',
              commentType: 'THEIR_SUMMARY',
              created: '2019-12-03T11:54:14.670Z',
              createdBy: 'string',
            },
          ],
        }
        item.statusText = COMPLETED
        item.complete = true
        item.hrefText = REVIEW_DETAILS
        expect(getFinalInformation(sentencePlan, stub, COMPLETE_OBJECTIVE)).toEqual(expected)
      })
    })
  })
  describe('with no objective completed', () => {
    describe('with no "YOUR_SUMMARY", "THEIR_SUMMARY"', () => {
      it('should return a "CANNOT_START_YET" state', () => {
        const sentencePlan = { comments: [] }
        item.statusText = CANNOT_START_YET
        item.href = ''
        item.hrefText = 'Add at least one objective first'
        expect(getFinalInformation(sentencePlan, stub, INCOMPLETE_OBJECTIVE)).toEqual(expected)
      })
    })
  })
})
