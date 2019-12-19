import puppeteer from 'puppeteer'

export const wait = async (callback: () => Promise<boolean | null>) => {
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
