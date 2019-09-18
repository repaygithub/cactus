import puppeteer from 'puppeteer'

const wait = async (callback: () => Promise<boolean | null>) => {
  const startTime = Date.now()
  return new Promise((resolve, reject) => {
    const check = async () => {
      if (await callback()) {
        resolve()
      } else if (Date.now() - startTime > 4500) {
        reject()
      } else {
        setTimeout(check, 50)
      }
    }

    setTimeout(check, 50)
  })
}

export const waitForDropdownList: (
  document: puppeteer.ElementHandle<Element>
) => Promise<Element | null> = async document => {
  await wait(async () => {
    const activeElement = await document.getProperty('activeElement')
    const role = await activeElement.getProperty('role')
    return activeElement && role === 'listbox'
  })
  return await document.getProperty('activeElement')
}
