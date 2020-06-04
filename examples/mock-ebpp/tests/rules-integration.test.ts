import { ClientFunction } from 'testcafe'
import makeActions from './helpers/actions'
import startStaticServer from './helpers/static-server'
import * as path from 'path'
import { queryByLabelText, queryByText } from '@testing-library/testcafe'
import { RulesData } from '../types'

const getApiData = ClientFunction(() => (window as any).apiData)

fixture('Rules Integration Tests')
  .before(async (ctx) => {
    ctx.server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
  })
  .after(async (ctx) => {
    await ctx.server.close()
  })
  .page('http://localhost:33567/rules')

test('fill out and submit the form sequentially', async (t: TestController) => {
  const { selectDropdownOption } = makeActions(t)

  await t.click(queryByText('Add Rule')).click(queryByText('Add Condition'))
  await selectDropdownOption('Name', 'A variable')
  await selectDropdownOption('Operator', 'Greater than')
  await selectDropdownOption('Value', '-1')
  await t.click(queryByText('Condition #1')).click(queryByText('Add Action'))
  await selectDropdownOption('Name', 'Do the thing')
  await t.click(queryByText('Submit'))

  const apiData: RulesData = await getApiData()
  await t.expect(apiData).eql([
    {
      key: 'rule-0',
      conditions: [
        { key: 'condition-0', variable: 'A variable', operator: 'Greater than', value: '-1' },
      ],
      actions: [{ key: 'action-0', action: 'Do the thing' }],
    },
  ])
})

test('fill out and submit the form with deleting and reordering', async (t: TestController) => {
  const { selectDropdownOption } = makeActions(t)

  await t.click(queryByText('Add Rule')).click(queryByText('Add Condition'))
  await selectDropdownOption('Name', 'A variable')
  await selectDropdownOption('Operator', 'Greater than')
  await selectDropdownOption('Value', '-1')
  await t.click(queryByText('Add Condition'))
  await selectDropdownOption('Name', 'Another variable')
  await selectDropdownOption('Operator', 'Less than')
  await selectDropdownOption('Value', '0')
  await t
    .click(queryByText('Condition #1'))
    .click(queryByLabelText('Delete Condition #1'))
    .click(queryByText('Add Action'))
  await selectDropdownOption('Name', 'Do the thing')
  await t.click(queryByText('Add Action'))
  await selectDropdownOption('Name', 'Do another thing')
  await t.click(queryByLabelText('Move Action #1 down')).click(queryByText('Submit'))

  const apiData: RulesData = await getApiData()
  await t.expect(apiData).eql([
    {
      key: 'rule-0',
      conditions: [
        { key: 'condition-1', variable: 'Another variable', operator: 'Less than', value: '0' },
      ],
      actions: [
        { key: 'action-1', action: 'Do another thing' },
        { key: 'action-0', action: 'Do the thing' },
      ],
    },
  ])
})
