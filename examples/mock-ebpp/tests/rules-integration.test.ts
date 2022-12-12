import { queryByLabelText, queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { ClientFunction } from 'testcafe'

import { RulesData } from '../types'
import makeActions, { clickWorkaround } from './helpers/actions'
import startStaticServer from './helpers/static-server'

const getApiData = ClientFunction((): RulesData => (window as any).apiData)

fixture('Rules Integration Tests')
  .before(async (ctx): Promise<void> => {
    ctx.server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
  })
  .after(async (ctx): Promise<void> => {
    await ctx.server.close()
  })
  .page('http://localhost:33567/rules')

test('fill out and submit the form sequentially', async (t: TestController): Promise<void> => {
  const { selectDropdownOption } = makeActions(t)

  await t.click(queryByText('Add Rule')).click(queryByText('Add Condition'))
  await selectDropdownOption('Name', 'A variable')
  await selectDropdownOption('Operator', 'Greater than')
  await selectDropdownOption('Value', '-1')
  await t.click(queryByText('Condition #1')).click(queryByText('Add Action'))
  await selectDropdownOption('Name', 'Do the thing')
  await clickWorkaround(queryByText('Submit'))

  await t.wait(3500)
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

test('fill out and submit the form with deleting and reordering', async (t: TestController): Promise<void> => {
  await t.maximizeWindow()
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
  await clickWorkaround(queryByLabelText('Move Action #1 down'))
  await clickWorkaround(queryByText('Submit'))

  await t.wait(3500)
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
