import { queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { Selector } from 'testcafe'

import makeActions from './helpers/actions'
import startStaticServer from './helpers/static-server'

fixture('FAQ Integration Tests')
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
  .page('http://localhost:33567/faq')

test('use the DOWN arrow key to navigate even after the order changes', async (t: TestController) => {
  const { focusAccordionHeaderByText, getActiveElement } = makeActions(t)
  await t.click(queryByText('Insert Accordion'))
  await focusAccordionHeaderByText('Lorem Ipsum?')
  await t.pressKey('down')
  const accordionButtonActiveEl = await getActiveElement()
  const accordionElId = accordionButtonActiveEl.attributes?.['aria-labelledby']
  await t
    .expect(accordionButtonActiveEl.focused)
    .ok('Accordion is not focused')
    .expect(accordionButtonActiveEl.attributes?.role)
    .eql('button')
    .expect(Selector(`#${accordionElId}`).textContent)
    .eql('What is EBPP?')

  await t.click(queryByText('Remove Accordion'))
  await focusAccordionHeaderByText('What is EBPP?')
  await t.pressKey('down')
  const accordionButtonActiveEl2 = await getActiveElement()
  const accordionElId2 = accordionButtonActiveEl2.attributes?.['aria-labelledby']
  await t
    .expect(accordionButtonActiveEl2.focused)
    .ok('Accordion is not focused')
    .expect(accordionButtonActiveEl2.attributes?.role)
    .eql('button')
    .expect(Selector(`#${accordionElId2}`).textContent)
    .eql('Why EBPP?')
})

test('use the UP arrow key to navigate even after the order changes', async (t: TestController) => {
  const { focusAccordionHeaderByText, getActiveElement } = makeActions(t)

  await t.click(queryByText('Insert Accordion'))
  await focusAccordionHeaderByText('Office Ipsum?')
  await t.pressKey('up')
  const accordionButtonActiveEl = await getActiveElement()
  const accordionElId = accordionButtonActiveEl.attributes?.['aria-labelledby']
  await t
    .expect(accordionButtonActiveEl.focused)
    .ok('Accordion is not focused')
    .expect(accordionButtonActiveEl.attributes?.role)
    .eql('button')
    .expect(Selector(`#${accordionElId}`).textContent)
    .eql('Cat Mojo I Show My Fluffy Belly?')

  await t.click(queryByText('Remove Accordion'))
  await focusAccordionHeaderByText('Cat Mojo I Show My Fluffy Belly?')
  await t.pressKey('up')
  const accordionButtonActiveEl2 = await getActiveElement()
  const accordionElId2 = accordionButtonActiveEl2.attributes?.['aria-labelledby']
  await t
    .expect(accordionButtonActiveEl2.focused)
    .ok('Accordion is not focused')
    .expect(accordionButtonActiveEl2.attributes?.role)
    .eql('button')
    .expect(Selector(`#${accordionElId2}`).textContent)
    .eql('What is Bill Presentment?')
})

test('use the HOME key to focus on the first accordion after the order changes', async (t: TestController) => {
  const { focusAccordionHeaderByText, getActiveElement } = makeActions(t)

  await t.click(queryByText('Insert Accordion'))
  await focusAccordionHeaderByText('Office Ipsum?')
  await t.pressKey('home')
  const accordionButtonActiveEl = await getActiveElement()
  const accordionElId = accordionButtonActiveEl.attributes?.['aria-labelledby']
  await t
    .expect(accordionButtonActiveEl.focused)
    .ok('Accordion is not focused')
    .expect(accordionButtonActiveEl.attributes?.role)
    .eql('button')
    .expect(Selector(`#${accordionElId}`).textContent)
    .eql('Lorem Ipsum?')
})

test('use the END key to focus on the first accordion after the order changes', async (t: TestController) => {
  const { focusAccordionHeaderByText, getActiveElement } = makeActions(t)

  await t.click(queryByText('Insert Accordion'))
  await focusAccordionHeaderByText('Lorem Ipsum?')
  await t.pressKey('end')
  const accordionButtonActiveEl = await getActiveElement()
  const accordionElId = accordionButtonActiveEl.attributes?.['aria-labelledby']
  await t
    .expect(accordionButtonActiveEl.focused)
    .ok('Accordion is not focused')
    .expect(accordionButtonActiveEl.attributes?.role)
    .eql('button')
    .expect(Selector(`#${accordionElId}`).textContent)
    .eql('Office Ipsum?')
})
