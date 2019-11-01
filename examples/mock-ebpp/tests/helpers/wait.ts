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

export const sleep = async (seconds: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}

export async function getActiveElement(page: puppeteer.Page) {
  return (page.evaluateHandle(() => document.activeElement) as unknown) as puppeteer.ElementHandle<
    Element
  >
}

export const waitForDropdownList = async (page: puppeteer.Page) => {
  await wait(async () => {
    let activeElement: puppeteer.ElementHandle<Element> | null = await getActiveElement(page)

    activeElement = await activeElement.asElement()
    if (activeElement === null) {
      return false
    }
    const accessibility = await page.accessibility.snapshot({ root: activeElement })
    return accessibility.role === 'listbox'
  })
  return await getActiveElement(page)
}

export const waitForComboInput = async (page: puppeteer.Page) => {
  await wait(async () => {
    let activeElement: puppeteer.ElementHandle<Element> | null = await getActiveElement(page)

    activeElement = await activeElement.asElement()
    if (activeElement === null) {
      return false
    }
    const accessibility = await page.accessibility.snapshot({ root: activeElement })
    return accessibility.role === 'search'
  })
  return await getActiveElement(page)
}
