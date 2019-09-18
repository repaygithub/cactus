import { ApiData } from './types'
import puppeteer from 'puppeteer'

declare global {
  const __BROWSER__: puppeteer.Browser
  interface Window {
    apiData: ApiData
  }
}
