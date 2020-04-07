const expectedObjectives = {
  active: [
    {
      actions: [
        {
          description: 'In progress action description text',
          id: 'act1',
          motivationUUID: 'string',
          owner: ['SERVICE_USER'],
          priority: 0,
          progress: [],
          status: 'IN_PROGRESS',
          targetDate: '2020-08',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'In progress action description text',
        },
        {
          description: 'Completed action 2 description text',
          id: 'act2',
          intervention: '',
          motivationUUID: 'string',
          ownerOther: 'string',
          priority: 0,
          progress: [],
          status: 'COMPLETED',
          targetDate: '2020-04',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Completed action 2 description text',
        },
        {
          id: '8d7b6471-13ef-4bfd-847f-c51446f9a286',
          owner: ['SERVICE_USER', 'PRACTITIONER'],
          ownerOther: '',
          description: '',
          status: 'NOT_STARTED',
          intervention: '3fa85f64-5717-4562-b3fc-2c963f66afa2',
          motivationUUID: '55f90269-1d93-4a9a-921a-7bae73f3bf07',
          priority: 0,
          created: '2020-03-18T10:41:58.091869',
          updated: null,
          targetDate: '2021-12',
          progress: [],
          actionText: 'Intervention 2',
        },
      ],
      description: 'This is an active objective',
      id: 'obj1',
      needs: ['care'],
      priority: 0,
      type: 'active',
      actionsDisplay: [
        [
          {
            text: 'In progress action description text',
          },
          {
            format: 'numeric',
            text: 'August 2020',
          },
          {
            format: 'numeric',
            text: 'Doing it',
          },
        ],
        [
          {
            text: 'Completed action 2 description text',
          },
          {
            format: 'numeric',
            text: 'April 2020',
          },
          {
            format: 'numeric',
            text: 'Finished',
          },
        ],
        [
          {
            text: 'Intervention 2',
          },
          {
            format: 'numeric',
            text: 'December 2021',
          },
          {
            format: 'numeric',
            text: 'Not started',
          },
        ],
      ],
    },
    {
      actions: [
        {
          description: 'Not started action description text',
          id: 'act8',
          motivationUUID: 'string',
          owner: ['SERVICE_USER'],
          priority: 0,
          progress: [],
          status: 'NOT_STARTED',
          targetDate: '2022-09',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Not started action description text',
        },
        {
          description: 'Completed action description text',
          id: 'act9',
          intervention: '',
          motivationUUID: 'string',
          ownerOther: 'string',
          priority: 0,
          progress: [],
          status: 'COMPLETED',
          targetDate: '2020-03',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Completed action description text',
        },
        {
          description: 'Abandoned action description text',
          id: 'act10',
          intervention: '',
          motivationUUID: 'string',
          ownerOther: 'string',
          priority: 0,
          progress: [],
          status: 'ABANDONED',
          targetDate: '2021-02',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Abandoned action description text',
        },
      ],
      description: 'This should default to active',
      id: 'obj4',
      needs: ['care'],
      priority: 0,
      type: 'active',
      actionsDisplay: [
        [
          {
            text: 'Not started action description text',
          },
          {
            format: 'numeric',
            text: 'September 2022',
          },
          {
            format: 'numeric',
            text: 'Not started',
          },
        ],
        [
          {
            text: 'Completed action description text',
          },
          {
            format: 'numeric',
            text: 'March 2020',
          },
          {
            format: 'numeric',
            text: 'Finished',
          },
        ],
        [
          {
            text: 'Abandoned action description text',
          },
          {
            format: 'numeric',
            text: 'February 2021',
          },
          {
            format: 'numeric',
            text: 'Stopped',
          },
        ],
      ],
    },
  ],
  future: [
    {
      actions: [
        {
          description: 'Not started action 1 description text',
          id: 'act3',
          motivationUUID: 'string',
          owner: ['SERVICE_USER'],
          priority: 0,
          progress: [],
          status: 'NOT_STARTED',
          targetDate: '2020-11',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Not started action 1 description text',
        },
        {
          description: 'Not started action 2 description text',
          id: 'act4',
          intervention: '',
          motivationUUID: 'string',
          ownerOther: 'string',
          priority: 0,
          progress: [],
          status: 'NOT_STARTED',
          targetDate: '2021-04',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Not started action 2 description text',
        },
      ],
      description: 'This is a future objective',
      id: 'obj2',
      needs: ['care'],
      priority: 0,
      type: 'future',
      actionsDisplay: [
        [
          {
            text: 'Not started action 1 description text',
          },
          {
            format: 'numeric',
            text: 'November 2020',
          },
          {
            format: 'numeric',
            text: 'Not started',
          },
        ],
        [
          {
            text: 'Not started action 2 description text',
          },
          {
            format: 'numeric',
            text: 'April 2021',
          },
          {
            format: 'numeric',
            text: 'Not started',
          },
        ],
      ],
    },
  ],
  closed: [
    {
      actions: [
        {
          description: 'Completed action description text',
          id: 'act5',
          motivationUUID: 'string',
          owner: ['SERVICE_USER'],
          priority: 0,
          progress: [],
          status: 'COMPLETED',
          targetDate: '2020-01',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Completed action description text',
        },
        {
          description: 'Partially completed action 1 description text',
          id: 'act6',
          intervention: '',
          motivationUUID: 'string',
          ownerOther: 'string',
          priority: 0,
          progress: [],
          status: 'PARTIALLY_COMPLETED',
          targetDate: '2021-02',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Partially completed action 1 description text',
        },
        {
          description: 'Abandoned action description text',
          id: 'act7',
          intervention: '',
          motivationUUID: 'string',
          ownerOther: 'string',
          priority: 0,
          progress: [],
          status: 'ABANDONED',
          targetDate: '2020-12',
          updated: '2019-12-04T15:33:28.545Z',
          actionText: 'Abandoned action description text',
        },
      ],
      description: 'This is a completed objective',
      id: 'obj3',
      needs: ['care'],
      priority: 0,
      type: 'closed',
      actionsDisplay: [
        [
          {
            text: 'Completed action description text',
          },
          {
            format: 'numeric',
            text: 'January 2020',
          },
          {
            format: 'numeric',
            text: 'Finished',
          },
        ],
        [
          {
            text: 'Partially completed action 1 description text',
          },
          {
            format: 'numeric',
            text: 'February 2021',
          },
          {
            format: 'numeric',
            text: 'Did some',
          },
        ],
        [
          {
            text: 'Abandoned action description text',
          },
          {
            format: 'numeric',
            text: 'December 2020',
          },
          {
            format: 'numeric',
            text: 'Stopped',
          },
        ],
      ],
    },
  ],
}

module.exports = { expectedObjectives }
