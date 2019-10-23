import { queries } from 'pptr-testing-library'
import { waitForDropdownList } from './wait'
import puppeteer from 'puppeteer'

const { getByLabelText, getByText } = queries

export const fillTextField = async (
  doc: puppeteer.ElementHandle<Element>,
  label: string,
  text: string
) => {
  const field = await getByLabelText(doc, label)
  await field.click()
  await field.type(text)
}

export const selectDropdownOption = async (
  page: puppeteer.Page,
  doc: puppeteer.ElementHandle<Element>,
  label: string,
  optionText: string
) => {
  const selectTrigger = await getByLabelText(doc, label)
  await selectTrigger.click()
  const listbox = await waitForDropdownList(page)
  const option = await getByText(doc, optionText)
  // console.log(await option.asElement())
  await option.click()
}

export const uploadFile = async (
  page: puppeteer.Page,
  doc: puppeteer.ElementHandle<Element>,
  label: string
) => {
  const fileInputButton = await getByLabelText(doc, label)
  const [fileChooser] = await Promise.all([page.waitForFileChooser(), fileInputButton.click()])
  fileChooser.accept(['tests/test-data/test-logo.jpg'])
}

export const clickByText = async (doc: puppeteer.ElementHandle<Element>, label: string) => {
  const clickable = await getByText(doc, label)
  await clickable.click()
}

export function getInputValueByLabel(doc: puppeteer.ElementHandle<Element>, label: string) {
  return getByLabelText(doc, label)
    .then(i => i.getProperty('value'))
    .then(h => h.jsonValue())
}
