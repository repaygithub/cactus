import { queryByLabelText, queryByText, within } from '@testing-library/testcafe'
import { ClientFunction, Selector } from 'testcafe'

const getDropdown = Selector(() => {
  if (document.activeElement && document.activeElement.getAttribute('role') === 'listbox') {
    return document.activeElement
  }
  return null
})

const getCombo = Selector(() => {
  if (document.activeElement && document.activeElement.getAttribute('role') === 'search') {
    return document.activeElement
  }
  return null
})

const fillTextField = (t: TestController) => async (label: string, text: string) => {
  const field = queryByLabelText(label)
  await t.click(field).typeText(field, text)
}

const selectDropdownOption = (t: TestController) => async (
  label: string,
  optionOrOptions: string | Array<string>
) => {
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

const searchComboBox = (t: TestController) => async (
  label: string,
  optionOrOptions: string | Array<string>
) => {
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

const uploadFile = (t: TestController) => async (label: string) => {
  const fileInput = Selector('input[type=file]')
  const fileInputButton = queryByText(/Select Files/)
  await t.click(fileInputButton)
  await t.setFilesToUpload(fileInput, ['test-data/test-logo.jpg'])
}

const focusAccordionHeaderByText = ClientFunction((text: string) => {
  window.TestingLibraryDom.queryByText(document.body, text)
    ?.parentElement?.querySelector('button')
    ?.focus()
})

const getActiveElement = Selector(() => document.activeElement)

export default (t: TestController) => ({
  fillTextField: fillTextField(t),
  focusAccordionHeaderByText,
  getActiveElement,
  searchComboBox: searchComboBox(t),
  selectDropdownOption: selectDropdownOption(t),
  uploadFile: uploadFile(t),
})
