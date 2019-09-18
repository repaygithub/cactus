import * as path from 'path'
import os from 'os'

export const DIR: string = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
