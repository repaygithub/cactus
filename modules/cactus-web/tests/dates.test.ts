import {
  formatDate,
  getDefaultFormat,
  getLocaleFormat,
  PartialDate,
} from '../src/helpers/dates'

describe('date helpers', (): void => {
  describe('getLocalFormat()', (): void => {
    test('getLocaleFormat("en", { type: "date" }) returns correct format', (): void => {
      const format = getLocaleFormat('en', { type: 'date' })
      expect(format).toEqual('MM/dd/YYYY')
    })

    test('getLocaleFormat("en", { type: "datetime" }) returns correct format', (): void => {
      const format = getLocaleFormat('en', { type: 'datetime' })
      expect(format).toEqual('MM/dd/YYYY, hh:mm aa')
    })

    test('getLocaleFormat("en", { type: "time" }) returns correct format', (): void => {
      const format = getLocaleFormat('en', { type: 'time' })
      expect(format).toEqual('hh:mm aa')
    })

    // TODO move to integration tests when available since Intl is not fully included in Node
    // https://github.com/nodejs/node/pull/29522
    test.skip('can parse es locale', (): void => {
      const format = getLocaleFormat('es')
      expect(format).toEqual('dd/MM/YYYY, H:mm')
    })
  })

  describe('getDefaultFormat()', (): void => {
    test('default formats changes are a breaking change', (): void => {
      expect(getDefaultFormat('date')).toBe('YYYY-MM-dd')
      expect(getDefaultFormat('datetime')).toBe('YYYY-MM-ddTHH:mm')
      expect(getDefaultFormat('time')).toBe('HH:mm')
    })
  })

  describe('formatDate()', (): void => {
    test('YYYY-MM-dd', (): void => {
      expect(formatDate(new Date(2018, 7, 12), 'YYYY-MM-dd')).toEqual('2018-08-12')
    })

    test('MM/dd/YYYY', (): void => {
      expect(formatDate(new Date(2018, 7, 12), 'MM/dd/YYYY')).toEqual('08/12/2018')
    })

    test('YYYY-MM-dd H:mm', (): void => {
      expect(formatDate(new Date(2018, 7, 12, 5, 23), 'YYYY-MM-ddTH:mm')).toEqual('2018-08-12T5:23')
    })

    test('YYYY-MM-dd h:mm aa', (): void => {
      expect(formatDate(new Date(2018, 7, 12, 5, 23), 'YYYY-MM-dd h:mm aa')).toEqual(
        '2018-08-12 5:23 AM'
      )
    })
  })

  describe('class PartialDate', (): void => {
    describe('constructor()', (): void => {
      test('constructor can receive blank string and will return all placeholders', (): void => {
        const pd = new PartialDate('')
        expect(pd.format()).toEqual('####-##-##')
      })

      test('constructor can receive a partial date string and will return a partial date', (): void => {
        const pd = new PartialDate('01/##/2018', 'MM/dd/YYYY')
        expect(pd.format('YYYY-MM-dd')).toEqual('2018-01-##')
      })

      test('can be given a DateType', (): void => {
        const pd = new PartialDate('', { type: 'time' })
        expect(pd.format()).toEqual('##:##')
      })

      test('constructed with 24 hour time will set period', (): void => {
        const pd = new PartialDate('2018-10-10 11:34', {
          type: 'datetime',
          format: 'YYYY-MM-dd HH:mm',
        })
        expect(pd.format('hh:mm aa')).toEqual('11:34 AM')
      })
    })

    describe('#toDate()', (): void => {
      test('will set hours and mintutes to zero when not provided', (): void => {
        const pd = new PartialDate('01/15/2018', 'MM/dd/YYYY')
        expect(pd.toDate()).toEqual(new Date(2018, 0, 15, 0, 0))
      })

      test('will set hours and mintutes to zero when not provided', (): void => {
        const pd = new PartialDate('01/15/2018', 'MM/dd/YYYY')
        expect(pd.toDate()).toEqual(new Date(2018, 0, 15, 0, 0))
      })

      test('correctly sets leap day when format sets month before year', (): void => {
        const pd = new PartialDate('02/29/2020', 'MM/dd/YYYY')
        expect(pd.toDate()).toEqual(new Date(2020, 1, 29))
      })

      test('correctly sets the year when year is less than 100', (): void => {
        const pd = new PartialDate('01/02/0004', 'MM/dd/YYYY')
        const expected = new Date()
        expected.setFullYear(4, 0, 2)
        expected.setHours(0, 0, 0, 0)
        expect(pd.toDate()).toEqual(expected)
      })

      test('correctly updates the year when year becomes less than 100', (): void => {
        const pd = new PartialDate('01/02/2020', 'MM/dd/YYYY')
        pd.setYear(38)
        const expected = new Date()
        expected.setFullYear(38, 0, 2)
        expected.setHours(0, 0, 0, 0)
        expect(pd.toDate()).toEqual(expected)
      })

      describe('with mocked Date', (): void => {
        // Date is mocked to produce a consistent test which fails when the
        // minutes are close to the end of the hour and then the year changes
        // dramatically
        const _Date = global.Date
        class MockDate extends Date {
          private constructor() {
            super()
            this.setHours(11, 53)
          }
        }

        beforeAll((): void => {
          // @ts-ignore
          global.Date = MockDate
        })

        afterAll((): void => {
          global.Date = _Date
        })

        test('leaves time stable during large year changes', (): void => {
          const pd = new PartialDate('01/02/2020T11:53', {
            format: 'MM/dd/YYYYTHH:mm',
            type: 'datetime',
          })
          pd.setYear(2)
          const expected = new _Date()
          expected.setFullYear(2, 0, 2)
          expected.setHours(11, 53, 0, 0)
          expect(pd.toDate()).toEqual(expected)
        })
      })
    })

    describe('#parse()', (): void => {
      test('sets the value of the PartialDate to the parsed string', (): void => {
        const pd = new PartialDate('1/14/2018', 'M/d/YYYY')
        pd.parse('2019-02-14', 'YYYY-MM-dd')
        expect(pd.format('M/d/YYYY')).toEqual('2/14/2019')
      })

      test('only sets provided values from parsed string', (): void => {
        const pd = new PartialDate('01/14/2018, 1:24 AM', 'MM/dd/YYYY, h:mm aa')
        pd.parse('2019-02-14', 'YYYY-MM-dd')
        expect(pd.format()).toEqual('02/14/2019, 1:24 AM')
      })

      test('uses internal format when not provided', (): void => {
        const pd = new PartialDate('2019-12-01 12:00', { type: 'datetime' })
        pd.parse('2019-12-17 12:00')
        expect(pd.toLocaleFormat()).toEqual('12/17/2019, 12:00 PM')
      })
    })

    describe('#format()', (): void => {
      test('will use provided format by default', (): void => {
        const pd = new PartialDate('2019-08-01', 'YYYY-MM-dd')
        expect(pd.format()).toEqual('2019-08-01')
      })
    })

    describe('format setters and getters', (): void => {
      test('YYYY', (): void => {
        const pd = new PartialDate('', 'YYYY-MM')
        pd.YYYY = '2020'
        expect(pd.format()).toEqual('2020-##')
      })

      test('MM', (): void => {
        const pd = new PartialDate('', 'YYYY-MM')
        pd.MM = '12'
        expect(pd.format()).toEqual('####-12')
      })

      test('dd', (): void => {
        const pd = new PartialDate('', 'YYYY-MM-dd')
        pd.dd = '31'
        expect(pd.format()).toEqual('####-##-31')
      })

      test('hh:mm aa', (): void => {
        const pd = new PartialDate('', 'hh:mm aa')
        pd.hh = '2'
        pd.mm = '45'
        pd.aa = 'PM'
        expect(pd.format()).toEqual('02:45 PM')
      })

      test('hh + aa => HH', (): void => {
        const pd = new PartialDate('', 'hh:mm aa')
        pd.hh = '2'
        pd.aa = 'PM'
        expect(pd.format('HH')).toEqual('14')
      })
    })

    describe('isValid()', (): void => {
      test('time is valid with hours and minutes set', (): void => {
        const pd = new PartialDate('2:34', { format: 'H:mm', type: 'time' })
        expect(pd.isValid()).toBe(true)
        pd.H = undefined
        expect(pd.isValid()).toBe(false)
      })

      test('date is valid with year, month, and day set', (): void => {
        const pd = new PartialDate('', { type: 'date' })
        expect(pd.isValid()).toBe(false)
        pd.YYYY = '2019'
        expect(pd.isValid()).toBe(false)
        pd.dd = '13'
        expect(pd.isValid()).toBe(false)
        pd.MM = '04'
        expect(pd.isValid()).toBe(true)
      })

      test('datetime is valid only with everything set', (): void => {
        const pd = new PartialDate('', { type: 'datetime' })
        expect(pd.isValid()).toBe(false)
        pd.YYYY = '2019'
        expect(pd.isValid()).toBe(false)
        pd.dd = '13'
        expect(pd.isValid()).toBe(false)
        pd.MM = '04'
        pd.h = '5'
        pd.mm = '57'
        pd.aa = 'PM'
        expect(pd.isValid()).toBe(true)
      })
    })
  })

  describe('#clone() creates a new duplicate PartialDate', (): void => {
    test('when type=date', (): void => {
      const pd = new PartialDate('2018-02-14', 'YYYY-MM-dd')
      const pd2 = pd.clone()
      expect(pd).not.toBe(pd2)
      expect(pd.format()).toEqual(pd2.format())
    })

    test('when type=time', (): void => {
      const pd = new PartialDate('15:23', 'H:mm')
      const pd2 = pd.clone()
      expect(pd).not.toBe(pd2)
      expect(pd.format()).toEqual(pd2.format())
    })
  })

  describe('#equals()', (): void => {
    test('can test two PartialDate as equal', (): void => {
      const pd = new PartialDate('2019-02-14', 'YYYY-MM-dd')
      const pd2 = pd.clone()
      expect(pd).not.toBe(pd2)
      expect(pd.equals(pd2)).toBe(true)
    })
  })
})
