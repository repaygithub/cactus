import { getActiveElement, sleep, waitForComboInput, waitForDropdownList } from './wait'
import { queries } from 'pptr-testing-library'
import puppeteer, { ElementHandle } from 'puppeteer'

const { getByLabelText, getByText, getByRole } = queries

class Actions {
  constructor(doc: puppeteer.ElementHandle<Element>, page: puppeteer.Page) {
    this.doc = doc
    this.page = page
  }

  doc: puppeteer.ElementHandle<Element>
  page: puppeteer.Page

  fillTextField = async (label: string, text: string) => {
    const field = await getByLabelText(this.doc, label)
    await field.click()
    await field.type(text)
  }

  selectDropdownOption = async (label: string, optionOrOptions: string | Array<string>) => {
    const selectTrigger = await getByLabelText(this.doc, label)
    await selectTrigger.click()
    const listbox = await waitForDropdownList(this.page)
    if (typeof optionOrOptions === 'string') {
      const option = await getByText(listbox, optionOrOptions)
      await option.click()
    } else if (Array.isArray(optionOrOptions)) {
      for (let i = 0; i < optionOrOptions.length; i++) {
        const option = await getByText(listbox, optionOrOptions[i])
        await option.click()
      }
      await this.page.keyboard.press('Escape')
    }
  }

  searchComboBox = async (label: string, optionOrOptions: string | Array<string>) => {
    const comboTrigger = await getByLabelText(this.doc, label)
    await comboTrigger.click()
    await waitForComboInput(this.page)
    if (typeof optionOrOptions === 'string') {
      await this.page.keyboard.type(optionOrOptions)
      await this.page.keyboard.press('ArrowDown')
      await this.page.keyboard.press('Enter')
    } else if (Array.isArray(optionOrOptions)) {
      for (let i = 0; i < optionOrOptions.length; i++) {
        await this.page.keyboard.type(optionOrOptions[i])
        await this.page.keyboard.press('ArrowDown')
        await this.page.keyboard.press('Enter')
        const optionChars = optionOrOptions[i].split('')
        for (let j = 0; j < optionChars.length; j++) {
          await this.page.keyboard.press('Backspace')
        }
      }
      await this.page.keyboard.press('Escape')
    }
  }

  selectMobileDropdownOption = async (label: string, optionOrOptions: string | Array<string>) => {
    const selectTrigger = await getByLabelText(this.doc, label)
    await this.page.waitFor(1000)
    await selectTrigger.tap()
    const listbox = await waitForDropdownList(this.page)
    if (typeof optionOrOptions === 'string') {
      const option = await getByText(listbox, optionOrOptions)
      await option.tap()
    } else if (Array.isArray(optionOrOptions)) {
      for (let i = 0; i < optionOrOptions.length; i++) {
        const option = await getByText(listbox, optionOrOptions[i])
        await option.tap()
      }
      const listWrapper = (await listbox.evaluateHandle(lb =>
        lb.closest('[role=dialog]')
      )) as ElementHandle<Element>
      const doneButton = await getByText(listWrapper, 'Done')
      await doneButton.tap()
    }
  }

  uploadFile = async (label: string) => {
    const fileInputButton = await getByLabelText(this.doc, label)
    const [fileChooser] = await Promise.all([
      this.page.waitForFileChooser(),
      fileInputButton.click(),
    ])
    fileChooser.accept(['tests/test-data/test-logo.jpg'])
  }

  clickByText = async (label: string) => {
    const clickable = await getByText(this.doc, label)
    await clickable.click()
  }

  getInputValueByLabel = async (label: string) => {
    return getByLabelText(this.doc, label)
      .then(i => i.getProperty('value'))
      .then(h => h.jsonValue())
  }

  focusAccordionHeaderByText = async (headerText: string) => {
    const accordionHeader = await getByText(this.doc, headerText)
    const accordionHeaderButton = (await accordionHeader.evaluateHandle(as =>
      as.parentElement.querySelector('button')
    )) as ElementHandle<Element>
    await accordionHeaderButton.focus()
  }

  pressKey = async (key: string) => {
    await this.page.keyboard.press(key)
  }

  getActiveAccessibility = async () => {
    await sleep(0.2)
    let activeElHandle = await getActiveElement(this.page)
    let activeEl = await activeElHandle.asElement()
    if (activeEl === null) {
      return
    }
    return this.page.accessibility.snapshot({ root: activeEl })
  }

  clickByQuerySelector = async (selector: string) => {
    const clickable = await this.page.$(selector)
    if (clickable !== null) {
      await clickable.click()
    } else {
      console.warn(`Unable to find element using selector ${selector}`)
    }
  }
}

export default Actions
