import { queryByLabelText, queryByText, within } from '@testing-library/testcafe'
import { ClientFunction, Selector } from 'testcafe'

const getDropdown = Selector(() => {
  if (document.activeElement && document.activeElement.getAttribute('role') === 'listbox') {
    return document.activeElement
  }
  return null
})

const getCombo = Selector(() => {
  if (document.activeElement && document.activeElement.getAttribute('role') === 'textbox') {
    return document.activeElement
  }
  return null
})

const fillTextField = (
  t: TestController
): ((label: string, text: string) => Promise<void>) => async (
  label: string,
  text: string
): Promise<void> => {
  const field = queryByLabelText(label)
  await t.click(field).typeText(field, text)
}

const selectDropdownOption = (
  t: TestController
): ((label: string, optionOrOptions: string | string[]) => Promise<void>) => async (
  label: string,
  optionOrOptions: string | string[]
): Promise<void> => {
  const selectTrigger = queryByLabelText(label)
  await t.click(selectTrigger)
  const dropdownList = getDropdown()
  if (typeof optionOrOptions === 'string') {
    await t.click(within(dropdownList).queryByText(optionOrOptions))
  } else if (Array.isArray(optionOrOptions)) {
    for (let i = 0; i < optionOrOptions.length; i++) {
      await t.click(within(dropdownList).queryByText(optionOrOptions[i]))
    }
    await t.pressKey('esc')
  }
}

const searchComboBox = (
  t: TestController
): ((label: string, optionOrOptions: string | string[]) => Promise<void>) => async (
  label: string,
  optionOrOptions: string | string[]
): Promise<void> => {
  const comboTrigger = queryByLabelText(label)
  await t.click(comboTrigger)
  const comboInput = getCombo()

  if (typeof optionOrOptions === 'string') {
    await t.typeText(comboInput, optionOrOptions).pressKey('down').pressKey('enter')
  } else if (Array.isArray(optionOrOptions)) {
    for (let i = 0; i < optionOrOptions.length; i++) {
      await t.typeText(comboInput, optionOrOptions[i]).pressKey('down').pressKey('enter')
      const optionChars = optionOrOptions[i].split('')
      for (let j = 0; j < optionChars.length; j++) {
        await t.pressKey('backspace')
      }
    }
    await t.pressKey('esc')
  }
}

const uploadFile = (t: TestController): (() => Promise<void>) => async (): Promise<void> => {
  const fileInput = Selector('input[type=file]')
  const fileInputButton = queryByText(/Select Files/)
  await t.click(fileInputButton)
  await t.setFilesToUpload(fileInput, ['test-data/test-logo.jpg'])
}

const focusAccordionHeaderByText = ClientFunction((text: string): void => {
  window.TestingLibraryDom.queryByText(document.body, text)
    ?.parentElement?.querySelector('button')
    ?.focus()
})

const getActiveElement = Selector(() => document.activeElement)

export default (
  t: TestController
): {
  fillTextField: (label: string, text: string) => Promise<void>
  focusAccordionHeaderByText: (text: string) => void
  getActiveElement: Selector
  searchComboBox: (label: string, optionOrOptions: string | string[]) => Promise<void>
  selectDropdownOption: (label: string, optionOrOptions: string | string[]) => Promise<void>
  uploadFile: () => Promise<void>
} => ({
  fillTextField: fillTextField(t),
  focusAccordionHeaderByText,
  getActiveElement,
  searchComboBox: searchComboBox(t),
  selectDropdownOption: selectDropdownOption(t),
  uploadFile: uploadFile(t),
})
