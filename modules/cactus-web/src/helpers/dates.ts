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
  '08': 'hh',
  '8': 'h',
  '21': 'H',
  '41': 'mm',
  PM: 'aa',
}

export const TOKEN_FORMATTERS: { [token in FormatTokenType]: (date: Date) => string } = {
  M: (date: Date): string => (date.getMonth() + 1).toString(),
  MM: (date: Date): string => ('0' + (date.getMonth() + 1).toString()).slice(-2),
  d: (date: Date): string => date.getDate().toString(),
  dd: (date: Date): string => ('0' + date.getDate().toString()).slice(-2),
  YYYY: (date: Date): string => date.getFullYear().toString(),
  h: (date: Date): string => (date.getHours() % 12 || 12).toString(),
  hh: (date: Date): string => ('0' + (date.getHours() % 12 || 12).toString()).slice(-2),
  H: (date: Date): string => date.getHours().toString(),
  HH: (date: Date): string => ('0' + date.getHours().toString()).slice(-2),
  mm: (date: Date): string => ('0' + date.getMinutes().toString()).slice(-2),
  aa: (date: Date): string => (date.getHours() >= 12 ? 'PM' : 'AM'),
}

export const TOKEN_SETTERS: { [token in FormatTokenType]: (date: Date, value: string) => void } = {
  M(date, value): void {
    date.setMonth(Number(value) - 1)
  },
  MM(date, value): void {
    date.setMonth(Number(value) - 1)
  },
  d(date, value): void {
    date.setDate(Number(value))
  },
  dd(date, value): void {
    date.setDate(Number(value))
  },
  YYYY(date, value): void {
    date.setFullYear(Number(value))
  },
  h(date, value): void {
    date.setHours(Number(value))
  },
  hh(date, value): void {
    date.setHours(Number(value))
  },
  H(date, value): void {
    date.setHours(Number(value))
  },
  HH(date, value): void {
    date.setHours(Number(value))
  },
  mm(date, value): void {
    date.setMinutes(Number(value))
  },
  aa(date, value): void {
    if (/p/.test(value)) {
      date.setHours(date.getHours() + 12)
    }
  },
}

function matchAll(re: RegExp, str: string): string[] {
  const found: string[] = []
  let m: RegExpExecArray | null = null
  while ((m = re.exec(str))) {
    found.push(m[1])
  }
  return found
}

function repeat(char: string, num: number): string {
  let result = char
  while (result.length < num) {
    result += char
  }
  return result.slice(0, num)
}

function isNumber(x: any): x is number {
  return typeof x === 'number'
}

const __FORMAT_CACHE__: { [key: string]: string[] } = {}

export function parseFormat(formatStr: string): string[] {
  if (__FORMAT_CACHE__.hasOwnProperty(formatStr)) {
    return __FORMAT_CACHE__[formatStr]
  }
  return (__FORMAT_CACHE__[formatStr] = matchAll(/(([A-Za-z])\2*|.)/g, formatStr))
}

/**
 * Stores locale formats based on locale, type, and form.
 */
const __LOCALE_FORMATS_CACHE__: { [key: string]: string[] } = {}

interface GetLocaleformatOpt {
  // represents the time values to include in a format: date only, time only, or both.
  type: DateType
}
/** Returns an array representing how to format a date based on current locale */
export function getLocaleFormat(
  locale?: string,
  options: GetLocaleformatOpt = { type: 'date' }
): string {
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

    formatArray = matchAll(/(\d+|PM|[^0-9PM]+)/g, testDateString).map((m): string =>
      TOKEN_MATCHERS.hasOwnProperty(m) ? TOKEN_MATCHERS[m] : m
    )
  }
  return formatArray.join('')
}

export function getDefaultFormat(type: DateType): string {
  if (type === 'datetime') {
    return 'YYYY-MM-ddTHH:mm'
  } else if (type === 'time') {
    return 'HH:mm'
  }
  return 'YYYY-MM-dd'
}

export function formatDate(date: Date, format: string): string {
  const breakup = parseFormat(format)
  return breakup
    .map((token): string => {
      if (TOKEN_FORMATTERS.hasOwnProperty(token)) {
        return TOKEN_FORMATTERS[token as FormatTokenType](date)
      }
      return token
    })
    .join('')
}

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
      const format = result.format
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

/** used privately for defaults */
const TODAY = new Date()

const __LOCALE_SPOKEN_FORMATS_CACHE__: {
  [key: string]: InstanceType<typeof Intl.DateTimeFormat>
} = {}

export function getFormatter(
  type: DateType | Intl.DateTimeFormatOptions,
  locale: string = getLocale()
): (d: Date) => string {
  let formatter: InstanceType<typeof Intl.DateTimeFormat>
  const cacheKey = locale + type
  if (typeof type === 'object') {
    formatter = new Intl.DateTimeFormat(locale, type)
  } else if (__LOCALE_SPOKEN_FORMATS_CACHE__.hasOwnProperty(cacheKey)) {
    formatter = __LOCALE_SPOKEN_FORMATS_CACHE__[cacheKey]
  } else {
    const includeDate = type === 'date' || type === 'datetime'
    const includeTime = type === 'datetime' || type === 'time'
    const opts: Intl.DateTimeFormatOptions = {
      year: includeDate ? 'numeric' : undefined,
      month: includeDate ? 'long' : undefined,
      day: includeDate ? 'numeric' : undefined,
      weekday: includeDate ? 'long' : undefined,
      hour: includeTime ? 'numeric' : undefined,
      minute: includeTime ? '2-digit' : undefined,
      second: undefined,
      timeZone: 'UTC',
    }
    formatter = new Intl.DateTimeFormat(locale, opts)
  }
  return (d: Date) => formatter.format(d).replace('\u200e', '')
}

// `Date.toISOString()` messes with timezones and can return the wrong date;
// similarly `new Date(string)` treats ISO date strings like midnight UTC.
const zfill = (pad: string, num: number) => {
  const result = pad + num
  return result.slice(result.length - pad.length - 1)
}

/** Returns a date in ISO `YYYY-MM-dd` format. */
export const toISODate = (date: Date): string =>
  [
    zfill('000', date.getFullYear()),
    zfill('0', date.getMonth() + 1),
    zfill('0', date.getDate()),
  ].join('-')

/** Splits an ISO date and returns the year/month/day as an array of numbers. */
export const dateParts = (date: string): [number, number, number] => {
  const [year, month, day] = date.split('-')
  return [parseInt(year), parseInt(month) - 1, parseInt(day)]
}

/**
 * Sets the given value(s) on the Date; if the day overflows and
 * changes the month, it clamps to the last day of the given month.
 */
export const clampDate = (
  date: Date,
  method: 'day' | 'month' | 'year',
  value: number,
  maybeMonth?: number,
  maybeDay?: number
): Date => {
  let month: number = maybeMonth === undefined ? date.getMonth() : maybeMonth % 12
  if (method === 'month') {
    month = value % 12
    date.setMonth(value, maybeMonth ?? date.getDate())
  } else if (method === 'year') {
    date.setFullYear(value, month, maybeDay ?? date.getDate())
  } else {
    date.setDate(value)
  }
  if (month < 0) month += 12
  if (date.getMonth() !== month) {
    date.setDate(0)
  }
  return date
}

export function getLastDayOfMonth(month: number, year: number = TODAY.getFullYear()): number {
  const firstOfMonth = new Date(year, month, 1, 0, 0, 0, 0)
  const lastOfMonth = new Date(+firstOfMonth)
  lastOfMonth.setMonth(month + 1, 1)
  lastOfMonth.setDate(0)
  return lastOfMonth.getDate()
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
  public constructor(date?: string | Date, formatOrOpts?: string | Partial<PartialDateOpts>) {
    const { format, type, locale } = asOptions(formatOrOpts)
    this._input = date || ''
    this._locale = locale
    this._localeFormat = getLocaleFormat(locale, { type })
    this._format = format
    this._type = type
    if (date) {
      if (typeof date === 'string') {
        this.parse(date, this._format)
        if (this._format !== this._localeFormat) {
          this.parseTime(this._localeFormat)
        }
      } else if (!isNaN(+date)) {
        this.parse(formatDate(date, format), format)
      }
    }
  }
  private _input: string | Date
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

  private _year?: string
  private _month?: string
  private _day?: string
  private _hours?: string
  private _minutes?: string

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get M() {
    return this._month ? this._month.slice(-1) : ''
  }

  public set M(value: string | undefined) {
    if (value === undefined) {
      this.month = value
      this._month = value
    } else {
      this.month = Number(value) - 1
      this._month = value
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get MM() {
    return this._month ? this._month.slice(-2) : ''
  }

  public set MM(value: string | undefined) {
    this.M = value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get d() {
    return this._day ? Number(this._day).toString() : ''
  }

  public set d(value: string | undefined) {
    if (value === undefined) {
      this.day = value
      this._day = value
    } else {
      this.day = Number(value)
      this._day = value
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get dd() {
    return this._day ? this._day.slice(-2) : ''
  }

  public set dd(value: string | undefined) {
    this.d = value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get YYYY() {
    return this._year ? this._year.slice(-4) : ''
  }

  public set YYYY(value: string | undefined) {
    if (value === undefined) {
      this.year = value
      this._year = value
    } else {
      this.year = Number(value)
      this._year = value
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get h() {
    return this._hours ? Number(this._hours).toString() : ''
  }

  public set h(value: string | undefined) {
    if (value === undefined) {
      this.hours = value
      this._hours = value
    } else {
      this._hours = value
      const asNum = Number(value)
      if (this.period === 'PM') {
        this.hours = asNum < 12 ? asNum + 12 : asNum
      } else {
        this.hours = asNum > 11 ? asNum - 12 : asNum
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get hh() {
    return this._hours || ''
  }

  public set hh(value: string | undefined) {
    this.h = value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get H() {
    return this._hours ? Number(this._hours).toString() : ''
  }

  public set H(value: string | undefined) {
    if (value === undefined) {
      this.hours = value
      this._hours = value
    } else {
      this._hours = value
      this.hours = Number(value)
      this.period = this.hours > 11 ? 'PM' : 'AM'
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get HH() {
    return this._hours || ''
  }

  public set HH(value: string | undefined) {
    this.H = value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get mm() {
    return this._minutes || ''
  }

  public set mm(value: string | undefined) {
    if (value === undefined) {
      this.minutes = value
      this._minutes = value
    } else {
      this.minutes = Number(value)
      this._minutes = value
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get aa() {
    return this.period || ''
  }

  public set aa(value: string | undefined) {
    if (typeof value === 'string' && /[pa]/i.test(value) && value !== this.period) {
      const isPM = /p/i.test(value)
      this.period = isPM ? 'PM' : 'AM'
      if (this.hours !== undefined) {
        if (isPM) {
          this.hours = this.hours < 12 ? this.hours + 12 : this.hours
        } else {
          this.hours = this.hours > 11 ? this.hours - 12 : this.hours
        }
      }
    }
  }

  public getYear(): number {
    return this.year === undefined ? TODAY.getFullYear() : this.year
  }

  public setYear(value: number): void {
    this.year = value
    this._year = String(value)
  }

  public getMonth(): number {
    return this.month === undefined ? TODAY.getMonth() : this.month
  }

  public setMonth(value: number): void {
    this.month = value % 12
    const displayValue = (value % 12) + 1
    if (this._localeFormat.includes('MM')) {
      this._month = this.pad(displayValue)
    } else {
      this._month = String(displayValue)
    }
  }

  public getDate(): number {
    return this.day === undefined ? TODAY.getDate() : this.day
  }

  public setDate(value: number): void {
    this.day = value % 32
    if (this._localeFormat.includes('dd')) {
      this._day = this.pad(value % 32)
    } else {
      this._day = String(value % 32)
    }
  }

  public getHours(): number {
    return this.hours || 0
  }

  public get_Hours(): string {
    return this._hours || ''
  }

  public setHours(value: number): void {
    if (this._localeFormat.includes('aa')) {
      this.hours = this.period === 'PM' ? (value % 12) + 12 : value % 12
      this._hours = this.pad(value)
    } else {
      this.hours = value % 24
      this._hours = this.pad(value)
    }
  }

  public getMinutes(): number {
    return this.minutes || 0
  }

  public setMinutes(value: number): void {
    this._minutes = this.pad(value)
    this.minutes = value
  }

  public getLocaleFormat(): string {
    return this._localeFormat
  }

  public getFormat(): string {
    return this._format
  }

  public getLocale(): string {
    return this._locale
  }

  public setLocale(locale: string): void {
    this._locale = locale
    this._localeFormat = getLocaleFormat(locale, { type: this._type })
  }

  public getType(): DateType {
    return this._type
  }

  public setType(type: DateType, format: string): void {
    this._type = type
    this._format = format
    this._localeFormat = getLocaleFormat(this._locale, { type })
  }

  private pad(val?: number): string {
    return val === undefined ? '' : ('0' + val).slice(-2)
  }

  public parse(dateStr: string, format: string = this._format): PartialDate {
    const parsedFormat = parseFormat(format)
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

  public format(format?: string): string {
    const parsed = parseFormat(format || this._format)
    let result = ''
    for (const token of parsed) {
      if (isToken(token)) {
        let val = this[token]
        if (/[H]/.test(token)) {
          val = this.hours?.toString() || ''
        }
        if (/[MmdhH]/.test(token) && val !== '' && val !== undefined) {
          const padLength = val.length > 1 || token.length > 1 ? 2 : 1
          val = ('0' + val).slice(-padLength)
        }
        result += val !== '' ? val : repeat('#', token.length)
      } else {
        result += token
      }
    }
    return result
  }

  public parseTime(format?: string) {
    const parsed = parseFormat(format || this._format)
    for (const token of parsed) {
      if (isToken(token) && /[Hh]/.test(token)) {
        let val = Number(this[token])
        if (!Number.isNaN(val) && val !== undefined) {
          if (/[h]/.test(token)) {
            val = val % 12 || 12
            if (!this.period) {
              if (val > 12) {
                this.period = 'PM'
              } else {
                this.period = 'AM'
              }
            }
          } else if (/[H]/.test(token) && this.period && this.period === 'PM') {
            val = val + 12
          }
        }

        if (val) {
          this[token] = val.toString()
        }
      }
    }
    return this
  }

  public equals(date?: PartialDate, type: DateType = this._type): boolean {
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
          this.hours === date.hours && this.minutes === date.minutes && this.period === date.period
        )
      }
    }
    return false
  }

  public toLocaleFormat(): string {
    return this.format(this._localeFormat)
  }

  public toLocaleSpoken(type: DateType): string {
    const spokenFormatter = getFormatter(type, this._locale)
    return spokenFormatter(this.toDate())
  }

  public toDate(): Date {
    const date = new Date()
    date.setFullYear(this.getYear(), this.getMonth(), this.getDate())
    date.setHours(this.getHours(), this.getMinutes(), 0, 0)
    return date
  }

  public isValidDate(): boolean {
    return (
      this._type === 'time' ||
      ([this.year, this.month, this.day].every(isNumber) && this.isDayOfMonth(this.day || 0))
    )
  }

  public isValidTime(): boolean {
    const isValidHoursInterval = !!(this.hours !== undefined && this.hours >= 0 && this.hours < 24)
    const isValidHours =
      isValidHoursInterval &&
      (this._localeFormat.includes('h')
        ? Number(this._hours) > 0 && Number(this._hours) <= 12
        : true)
    const isValidMinutes = !!(this.minutes !== undefined && 0 <= this.minutes && this.minutes < 60)
    const aaIsValid = !this._localeFormat.includes('aa') || this.period !== undefined
    return (
      this._type === 'date' ||
      ([this.hours, this.minutes].every(isNumber) && isValidHours && isValidMinutes && aaIsValid)
    )
  }

  public isValid(): boolean {
    const isDateValid = this.isValidDate()
    const isTimeValid = this.isValidTime()

    return isDateValid && isTimeValid
  }

  public isDayOfMonth(day: number): boolean {
    const date = new Date(this.getYear(), this.getMonth(), 1)
    date.setDate(day)
    return date.getMonth() === this.getMonth()
  }

  public getLastDayOfMonth(): number {
    // naively assume 31 is the last day of month when month does not exist
    return this.month !== undefined ? getLastDayOfMonth(this.month, this.year) : 31
  }

  public ensureDayOfMonth(): void {
    if (this.day !== undefined && this.month !== undefined) {
      const lastDay = getLastDayOfMonth(this.month, this.year)
      if (this.day > lastDay) {
        this.day = lastDay
      }
    }
  }

  public clone(): PartialDate {
    const pd = new PartialDate('', {
      format: this._format,
      type: this._type,
      locale: this._locale,
    })
    pd._input = this._input
    pd.year = this.year
    pd.month = this.month
    pd.day = this.day
    pd.hours = this.hours
    pd.minutes = this.minutes
    pd.period = this.period
    pd._month = this._month
    pd._day = this._day
    pd._year = this._year
    pd._hours = this._hours
    pd._minutes = this._minutes
    return pd
  }

  public toValue(): Date | string | number {
    if (this.isValid()) {
      return typeof this._input === 'object' ? this.toDate() : this.format()
    }
    return NaN
  }

  public static from(
    date: null | string | Date | number | PartialDate,
    formatOrOpts?: string | Partial<PartialDateOpts>
  ): PartialDate {
    if (Number.isNaN(date)) {
      return new PartialDate('', formatOrOpts)
    } else if (date instanceof PartialDate) {
      return date.clone()
    } else if (typeof date !== 'string') {
      return new PartialDate(new Date(date ?? NaN), formatOrOpts)
    } else {
      return new PartialDate(date, formatOrOpts)
    }
  }
}

type FormatTokenMap = { [key in FormatTokenType]?: string | number }
interface PartialDateOpts {
  format: string
  locale: string
  type: DateType
}
