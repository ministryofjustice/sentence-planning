const serviceCreator = require('../../server/services/formService')
const motivationsConfig = require('../../server/config/motivations')
const stepConfig = require('../../server/config/step')

const formClient = {
  getFormDataForUser: jest.fn(),
  update: jest.fn(),
}
let service

beforeEach(() => {
  service = serviceCreator(formClient)
  formClient.getFormDataForUser.mockReturnValue({ rows: [{ a: 'b' }, { c: 'd' }] })
})

afterEach(() => {
  formClient.getFormDataForUser.mockReset()
  formClient.update.mockReset()
})

describe('getFormResponse', () => {
  test('it should call query on db', async () => {
    await service.getFormResponse('user1')
    expect(formClient.getFormDataForUser).toBeCalledTimes(1)
  })

  test('it should return the first row', async () => {
    const output = await service.getFormResponse('user1')
    expect(output).toEqual({ a: 'b' })
  })
})

describe('getValidationErrors', () => {
  const dependantConfig = {
    fields: [
      {
        q1: {
          responseType: 'requiredString',
          validationMessage: 'Please give a full name',
        },
      },
      {
        q2: {
          responseType: 'requiredYesNoIf_q1_Yes',
          validationMessage: 'Error q2',
        },
      },
    ],
  }

  test.each`
    formBody                                     | formConfig                       | expectedOutput
    ${{ q1: 'Yes' }}                             | ${dependantConfig}               | ${[{ href: '#q2', text: 'Error q2' }]}
    ${{ q1: 'No' }}                              | ${dependantConfig}               | ${[]}
    ${{ needs: ['a', 'b'], owner: 'c' }}         | ${stepConfig.step}               | ${[]}
    ${{ needs: ['a', 42], owner: 'c' }}          | ${stepConfig.step}               | ${[{ href: '#needs', text: '"1" must be a string' }]}
    ${{ needs: ['a', 'b'], owner: true }}        | ${stepConfig.step}               | ${[{ href: '#owner', text: 'Select the actions owner' }]}
    ${{ motivations: { bob: 'Contemplation' } }} | ${motivationsConfig.motivations} | ${[]}
    ${{ motivations: { 'pi+e': 'Action' } }}     | ${motivationsConfig.motivations} | ${[{ href: '#motivations', text: '"pi+e" is not allowed' }]}
    ${{ motivations: { mash: 'Sausage' } }}      | ${motivationsConfig.motivations} | ${[{ href: '#motivations', text: '"mash" must be one of [Pre-contemplation, Contemplation, Preparation, Action, Maintenance, Relapse]' }]}
  `('should return errors $expectedContent for form return', ({ formBody, formConfig, expectedOutput }) => {
    expect(service.getValidationErrors(formBody, formConfig)).toEqual(expectedOutput)
  })
})
