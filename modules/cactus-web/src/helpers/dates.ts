import getLocale from './locale'

export type FormatTokenType =
  | 'M'
  | 'MM'
  | 'd'
  | 'dd'
  | 'YYYY'
  | 'h'
  | 'hh'
  | 'H'
  | 'HH'
  | 'mm'
  | 'aa'
export const FORMAT_TOKENS: FormatTokenType[] = [
  'M',
  'MM',
  'd',
  'dd',
  'YYYY',
  'h',
  'hh',
  'H',
  'HH',
  'mm',
  'aa',
]
export type DateType = 'date' | 'datetime' | 'time'
export type DateForm = 'short' | 'spoken'

export function isToken(maybeToken: string): maybeToken is FormatTokenType {
  // @ts-ignore
  return FORMAT_TOKENS.includes(maybeToken)
}

// used to parse locale format with a specific value
const TOKEN_MATCHERS: { [value: string]: FormatTokenType } = {
  '1': 'M',
  '01': 'MM',
  '3': 'd',
  '03': 'dd',
  '1970': 'YYYY',
  '08': 'h',
  '8': 'h',
  '21': 'H',
  '41': 'mm',
  PM: 'aa',
}

export const TOKEN_FORMATTERS: { [token in FormatTokenType]: (date: Date) => string } = {
  M: (date: Date) => (date.getMonth() + 1).toString(),
  MM: (date: Date) => ('0' + (date.getMonth() + 1).toString()).slice(-2),
  d: (date: Date) => date.getDate().toString(),
  dd: (date: Date) => ('0' + date.getDate().toString()).slice(-2),
  YYYY: (date: Date) => date.getFullYear().toString(),
  h: (date: Date) => (date.getHours() % 12 || 12).toString(),
  hh: (date: Date) => ('0' + (date.getHours() % 12 || 12).toString()).slice(-2),
  H: (date: Date) => date.getHours().toString(),
  HH: (date: Date) => ('0' + date.getHours().toString()).slice(-2),
  mm: (date: Date) => ('0' + date.getMinutes().toString()).slice(-2),
  aa: (date: Date) => (date.getHours() >= 12 ? 'PM' : 'AM'),
}

export const TOKEN_SETTERS: { [token in FormatTokenType]: (date: Date, value: string) => void } = {
  M(date, value) {
    date.setMonth(Number(value) - 1)
  },
  MM(date, value) {
    date.setMonth(Number(value) - 1)
  },
  d(date, value) {
    date.setDate(Number(value))
  },
  dd(date, value) {
    date.setDate(Number(value))
  },
  YYYY(date, value) {
    date.setFullYear(Number(value))
  },
  h(date, value) {
    date.setHours(Number(value))
  },
  hh(date, value) {
    date.setHours(Number(value))
  },
  H(date, value) {
    date.setHours(Number(value))
  },
  HH(date, value) {
    date.setHours(Number(value))
  },
  mm(date, value) {
    date.setMinutes(Number(value))
  },
  aa(date, value) {
    if (/p/.test(value)) {
      date.setHours(date.getHours() + 12)
    }
  },
}

function matchAll(re: RegExp, str: string) {
  let found: string[] = []
  let m: RegExpExecArray | null = null
  while ((m = re.exec(str))) {
    found.push(m[1])
  }
  return found
}

function repeat(char: string, num: number) {
  let result = char
  while (result.length < num) {
    result += char
  }
  return result.slice(0, num)
}

function isNumber(x: any): x is Number {
  return typeof x === 'number'
}

const __FORMAT_CACHE__: { [key: string]: string[] } = {}

export function parseFormat(formatStr: string) {
  if (__FORMAT_CACHE__.hasOwnProperty(formatStr)) {
    return __FORMAT_CACHE__[formatStr]
  }
  return (__FORMAT_CACHE__[formatStr] = matchAll(/(([A-Za-z])\2*|.)/g, formatStr))
}

/**
 * Stores locale formats based on locale, type, and form.
 */
const __LOCALE_FORMATS_CACHE__: { [key: string]: string[] } = {}

type GetLocaleformatOpt = {
  // represents the time values to include in a format: date only, time only, or both.
  type: DateType
}
/** Returns an array representing how to format a date based on current locale */
export function getLocaleFormat(locale?: string, options: GetLocaleformatOpt = { type: 'date' }) {
  if (locale === undefined) {
    locale = getLocale()
  }
  const { type } = options
  const cacheKey = `${locale}-${type}`
  let formatArray: string[]
  if (__LOCALE_FORMATS_CACHE__.hasOwnProperty(cacheKey)) {
    formatArray = __LOCALE_FORMATS_CACHE__[cacheKey]
  } else {
    const includeDate = type === 'date' || type === 'datetime'
    const includeTime = type === 'datetime' || type === 'time'
    const testDateString = new Date(Date.UTC(1970, 0, 3, 20, 41, 58, 0)).toLocaleString(locale, {
      year: includeDate ? 'numeric' : undefined,
      month: includeDate ? '2-digit' : undefined,
      day: includeDate ? '2-digit' : undefined,
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
      second: undefined,
      timeZone: 'UTC',
    })

    formatArray = matchAll(/(\d+|PM|[^0-9PM]+)/g, testDateString).map(m =>
      TOKEN_MATCHERS.hasOwnProperty(m) ? TOKEN_MATCHERS[m] : m
    )
  }
  return formatArray.join('')
}

export function getDefaultFormat(type: DateType) {
  if (type === 'datetime') {
    return 'YYYY-MM-ddTHH:mm'
  } else if (type === 'time') {
    return 'HH:mm'
  }
  return 'YYYY-MM-dd'
}

export function formatDate(date: Date, format: string) {
  let breakup = parseFormat(format)
  return breakup
    .map(token => {
      if (TOKEN_FORMATTERS.hasOwnProperty(token)) {
        return TOKEN_FORMATTERS[token as FormatTokenType](date)
      }
      return token
    })
    .join('')
}

/**
 * Will attempt to parse a string as a date using the provided format,
 * and is not forgiving.
 */
export function parseDate(dateStr: string, format?: string): Date {
  if (!format) {
    return new Date(dateStr)
  }
  let parsedFormat = parseFormat(format)
  if (parsedFormat.length > 0) {
    let cursor = 0
    let partial = new PartialDate('', format)
    for (const token of parsedFormat) {
      if (isToken(token)) {
        let value = dateStr.charAt(cursor)
        while (/[0-9]/.test(dateStr.charAt(++cursor))) {
          value += dateStr.charAt(cursor)
        }
        partial[token] = value
      } else {
        cursor += token.length
      }
    }
    return partial.toDate()
  }

  return new Date(NaN)
}

export function isValidDate(date: Date) {
  return !isNaN(+date)
}

export function getLastDayOfMonth(month: number, year: number = TODAY.getFullYear()): number {
  let firstOfMonth = new Date(year, month, 1, 0, 0, 0, 0)
  let lastOfMonth = new Date(+firstOfMonth)
  lastOfMonth.setMonth(month + 1, 1)
  lastOfMonth.setDate(0)
  return lastOfMonth.getDate()
}

/** used privately for defaults */
const TODAY = new Date()

const __LOCALE_SPOKEN_FORMATS_CACHE__: {
  [key: string]: InstanceType<typeof Intl.DateTimeFormat>
} = {}

type FormatTokenMap = { [key in FormatTokenType]?: string | number }
type PartialDateOpts = { format: string; locale: string; type: DateType }

function asOptions(formatOrOpts?: string | Partial<PartialDateOpts>): PartialDateOpts {
  let result: Partial<PartialDateOpts> = {}
  if (typeof formatOrOpts === 'string') {
    result.format = formatOrOpts
  } else if (typeof formatOrOpts === 'object') {
    result = { ...formatOrOpts }
  }
  if (!result.locale) {
    result.locale = getLocale()
  }
  if (!result.type) {
    if (result.format) {
      let format = result.format
      if (format.includes('YYYY') || format.includes('dd')) {
        result.type = 'date'
        if (format.includes('h') || format.includes('H')) {
          result.type += 'time'
        }
      } else {
        result.type = 'time'
      }
    } else {
      result.type = 'date'
    }
  }
  if (!result.format) {
    result.format = getDefaultFormat(result.type as DateType)
  }
  return result as PartialDateOpts
}

/**
 * Partial date is to allow the saving and formatting of an incomplete date.
 * Values which are not available will be replaced with # when formatting,
 * therefore, # should not be used in a format string.
 *
 * A core assumption of this class is that your initial format will be considered
 * in all getters and setters
 */
export class PartialDate implements FormatTokenMap {
  constructor(date?: string, formatOrOpts?: string | Partial<PartialDateOpts>) {
    const { format, type, locale } = asOptions(formatOrOpts)
    this._locale = locale
    this._localeFormat = getLocaleFormat(locale, { type })
    this._format = format
    this._type = type
    if (date) {
      this.parse(date, this._format)
    }
  }
  private _locale: string
  private _localeFormat: string
  private _format: string
  private _type: DateType

  private year?: number
  // NOTE: this can be -1 when user writes 00
  private month?: number
  private day?: number
  private hours?: number
  private minutes?: number
  private period?: string

  get M() {
    return this.month === undefined ? '' : String(this.month + 1)
  }

  set M(value: string | number | undefined) {
    if (value === undefined) {
      this.month = value
    } else {
      this.month = Number(value) - 1
    }
  }

  get MM() {
    return this.month === undefined ? '' : this.pad(this.month + 1)
  }

  set MM(value: string | number | undefined) {
    this.M = value
  }

  get d() {
    return this.toRender(this.day, 1)
  }

  set d(value: string | number | undefined) {
    if (value === undefined) {
      this.day = undefined
    } else {
      this.day = Number(value) % 32
    }
  }

  get dd() {
    return this.toRender(this.day, 2)
  }

  set dd(value: string | number | undefined) {
    this.d = value
  }

  get YYYY() {
    return this.toRender(this.year, 4)
  }

  set YYYY(value: string | number | undefined) {
    if (value === undefined) {
      this.year = value
    } else {
      this.year = Number(value)
    }
  }

  get h() {
    if (this.hours === undefined) {
      return ''
    }
    let hours = this.hours % 12
    return String(hours === 0 ? 12 : hours)
  }

  set h(value: string | number | undefined) {
    if (value === undefined) {
      this.hours = value
    } else {
      let adj = this.hours && this.hours >= 12 ? 12 : 0
      this.setHours((Number(value) % 13) + adj)
    }
  }

  get hh() {
    if (this.hours === undefined) {
      return ''
    }
    let hours = this.hours % 12
    return this.toRender(hours === 0 ? 12 : hours, 2)
  }

  set hh(value: string | number | undefined) {
    this.h = value
  }

  get H() {
    return this.toRender(this.hours, 1)
  }

  set H(value: string | number | undefined) {
    if (value === undefined) {
      this.hours = value
    } else {
      value = Number(value)
      this.hours = value % 24
      this.period = value < 12 ? 'AM' : 'PM'
    }
  }

  get HH() {
    return this.pad(this.hours)
  }

  set HH(value: string | number | undefined) {
    this.H = value
  }

  get mm() {
    return this.pad(this.minutes)
  }

  set mm(value: string | number | undefined) {
    if (value === undefined) {
      this.minutes = value
    } else {
      this.minutes = Number(value) % 60
    }
  }

  get aa() {
    return this.period || ''
  }

  set aa(value: string | undefined) {
    if (typeof value === 'string' && /[pa]/i.test(value)) {
      this.period = /p/i.test(value) ? 'PM' : 'AM'
      if (this.hours === undefined) {
        return
      } else if (this.period === 'PM' && this.hours < 12) {
        this.hours = this.hours + 12
      } else if (this.period === 'AM' && this.hours >= 12) {
        this.hours = this.hours - 12
      }
    } else if (value === undefined) {
      this.period = value
    }
  }

  getYear() {
    return this.year === undefined ? TODAY.getFullYear() : this.year
  }

  setYear(value: number) {
    this.year = value
  }

  getMonth() {
    return this.month === undefined ? TODAY.getMonth() : this.month
  }

  setMonth(value: number) {
    this.month = value % 12
  }

  getDate() {
    return this.day === undefined ? TODAY.getDate() : this.day
  }

  setDate(value: number) {
    this.day = value % 32
  }

  getHours() {
    return this.hours || 0
  }

  setHours(value: number) {
    this.hours = value % 24
    this.period = value > 11 ? 'PM' : 'AM'
  }

  getMinutes() {
    return this.minutes || 0
  }

  setMinutes(value: number) {
    this.minutes = value % 60
  }

  getLocaleFormat() {
    return this._localeFormat
  }

  setLocale(locale: string) {
    this._locale = locale
    this._localeFormat = getLocaleFormat(locale, { type: this._type })
  }

  getType() {
    return this._type
  }

  setType(type: DateType, format: string) {
    this._type = type
    this._format = format
    this._localeFormat = getLocaleFormat(this._locale, { type })
  }

  private toRender(val: number | undefined, padTo: number) {
    if (val === undefined) {
      return ''
    }
    if (padTo > 1) {
      return ('000' + val).slice(-padTo)
    }
    return String(val)
  }

  private pad(val?: number) {
    return val === undefined ? '' : ('0' + val).slice(-2)
  }

  parse(dateStr: string, format: string = this._format) {
    let parsedFormat = parseFormat(format)
    let cursor = 0
    for (const token of parsedFormat) {
      if (isToken(token)) {
        let value = '',
          next = ''
        do {
          value += dateStr.charAt(cursor)
          next = dateStr.charAt(++cursor)
        } while (/[0-9#]/.test(next) || (token === 'aa' && /[pam]/i.test(next)))
        this[token] = /#/.test(value) ? undefined : value
      } else {
        cursor += token.length
      }
    }

    return this
  }

  format(format?: string) {
    const parsed = parseFormat(format || this._format)
    let result = ''
    for (const token of parsed) {
      if (isToken(token)) {
        let val = this[token]
        result += val !== '' ? val : repeat('#', token.length)
      } else {
        result += token
      }
    }
    return result
  }

  equals(date?: PartialDate, type: DateType = this._type): boolean {
    if (date instanceof PartialDate) {
      if (type === 'datetime') {
        return (
          this.year === date.year &&
          this.month === date.month &&
          this.day === date.day &&
          this.hours === date.hours &&
          this.minutes === date.minutes &&
          this.period === date.period
        )
      } else if (type === 'date') {
        return this.year === date.year && this.month === date.month && this.day === date.day
      } else if (type === 'time') {
        return (
          this.hours === date.hours && this.minutes === date.minutes && this.period === this.period
        )
      }
    }
    return false
  }

  toLocaleFormat() {
    return this.format(this._localeFormat)
  }

  toLocaleSpoken(type: DateType): string {
    let spokenFormatter: InstanceType<typeof Intl.DateTimeFormat>
    const cacheKey = this._locale + type
    if (__LOCALE_SPOKEN_FORMATS_CACHE__.hasOwnProperty(cacheKey)) {
      spokenFormatter = __LOCALE_SPOKEN_FORMATS_CACHE__[cacheKey]
    } else {
      const includeDate = type === 'date' || type === 'datetime'
      const includeTime = type === 'datetime' || type === 'time'
      const opts = {
        year: includeDate ? 'numeric' : undefined,
        month: includeDate ? 'long' : undefined,
        day: includeDate ? 'numeric' : undefined,
        weekday: includeDate ? 'long' : undefined,
        hour: includeTime ? 'numeric' : undefined,
        minute: includeTime ? '2-digit' : undefined,
        second: undefined,
        timeZone: 'UTC',
      }
      spokenFormatter = new Intl.DateTimeFormat(this._locale, opts)
    }

    return spokenFormatter.format(this.toDate())
  }

  toDate(): Date {
    let date = new Date()
    date.setFullYear(this.getYear(), this.getMonth(), this.getDate())
    date.setHours(this.getHours(), this.getMinutes(), 0, 0)
    return date
  }

  isValid(): boolean {
    const type = this._type
    let isValidDate =
      type === 'time' ||
      ([this.year, this.month, this.day].every(isNumber) && this.isDayOfMonth(this.day || 0))
    let isValidTime =
      type === 'date' ||
      (this.hours !== undefined &&
        this.minutes !== undefined &&
        (!this._format.includes('aa') || this.period !== undefined))

    return isValidDate && isValidTime
  }

  isDayOfMonth(day: number): boolean {
    let date = new Date(this.getYear(), this.getMonth(), 1)
    date.setDate(day)
    return date.getMonth() === this.getMonth()
  }

  getLastDayOfMonth() {
    // naively assume 31 is the last day of month when month does not exist
    return this.month !== undefined ? getLastDayOfMonth(this.month, this.year) : 31
  }

  ensureDayOfMonth() {
    if (this.day !== undefined && this.month !== undefined) {
      const lastDay = getLastDayOfMonth(this.month, this.year)
      if (this.day > lastDay) {
        this.day = lastDay
      }
    }
  }

  clone() {
    let pd = new PartialDate('', {
      format: this._format,
      type: this._type,
      locale: this._locale,
    })
    pd.year = this.year
    pd.month = this.month
    pd.day = this.day
    pd.hours = this.hours
    pd.minutes = this.minutes
    pd.period = this.period
    return pd
  }

  static from(
    date?: null | string | Date | PartialDate,
    formatOrOpts?: string | Partial<PartialDateOpts>
  ) {
    if (date == null) {
      return new PartialDate('', formatOrOpts)
    } else if (date instanceof PartialDate) {
      return date.clone()
    } else if (date instanceof Date) {
      if (isNaN(+date)) {
        return new PartialDate('', formatOrOpts)
      } else {
        let opts = asOptions(formatOrOpts)
        let dateStr = formatDate(date, opts.format)
        return new PartialDate(dateStr, opts)
      }
    } else {
      return new PartialDate(date, formatOrOpts)
    }
  }
}
