import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement } from 'react'

import DateInput from './DateInput'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

export default {
  title: 'DateInput',
  component: DateInput,
} as Meta

export const BasicUsage = (): ReactElement => (
  <DateInput
    id="date-input-uncontrolled"
    name="date"
    {...eventLoggers}
    disabled={boolean('disabled', false)}
  />
)

BasicUsage.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const ControlledWithDate = (): ReactElement => {
  const [value, setValue] = React.useState<Date | string | null>(new Date('10/1/2020'))
  return (
    <DateInput
      disabled={boolean('disabled', false)}
      id="date-input-1"
      name={text('name', 'date-input')}
      type={select('type', ['date', 'datetime', 'time'], 'date')}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

ControlledWithDate.storyName = 'Controlled with Date'
ControlledWithDate.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
  beforeScreenshot: async (page: Page) => {
    await page.click('button')
  },
}

export const ControlledWithString = (): ReactElement => {
  const [value, setValue] = React.useState<Date | string | null>('2019-09-16')
  return (
    <DateInput
      disabled={boolean('disabled', false)}
      id="date-input-with-string-value"
      name={text('name', 'date-input-with-string-value')}
      value={value}
      format="YYYY-MM-dd"
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

ControlledWithString.storyName = 'Controlled with string'
ControlledWithString.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const TypeTime = (): ReactElement => (
  <DateInput
    id="time-input"
    name="time"
    type="time"
    {...eventLoggers}
    disabled={boolean('disabled', false)}
  />
)

TypeTime.storyName = 'type="time"'

export const TypeDatetime = (): ReactElement => (
  <DateInput
    id="datetime-input"
    name="datetime"
    type="datetime"
    {...eventLoggers}
    disabled={boolean('disabled', false)}
  />
)

TypeDatetime.storyName = 'type="datetime"'

export const WithIsValidDate = (): ReactElement => (
  <div>
    <DateInput
      disabled={boolean('disabled', false)}
      type="date"
      id="date-with-blackouts"
      name="date_with_blackouts"
      isValidDate={(date): boolean => {
        const day = date.getDay()
        return day !== 0 && day !== 6
      }}
    />
    <p>Only business days are allowed.</p>
  </div>
)

WithIsValidDate.storyname = 'with isValidDate'

const FakeScroll = () => {
  const [values, setValues] = React.useState({})
  const [list, setList] = React.useState({ start: -2, offset: 0, items: [] })
  const onWheel = React.useCallback((e) => {
    const scroll = getScroll(e)
    setValues(scroll)
    if (scroll.y) {
      setList(({ start, offset, items }) => {
        offset += scroll.y
        const itemHeight = 27
        const itemCount = items.length
        while (offset > itemHeight) {
          start += 1
          offset -= itemHeight
        }
        if (offset > 0) {
          offset -= itemHeight
        }
        while (offset <= -itemHeight) {
          start -= 1
          offset += itemHeight
        }
        items = []
        for (let i = 0; i < itemCount; i++) {
          items.push(i - 1 + start)
        }
        return { start, offset, items }
      })
    }
  }, [])
  const listRef = React.useRef(null)
  React.useLayoutEffect(() => {
    if (listRef.current) {
      const height = 156 //listRef.current.clientHeight
      const itemHeight = 27
      const itemCount = Math.ceil(height / itemHeight) + 1
      setList((l) => {
        const items = []
        for (let i = 0; i < itemCount; i++) {
          items.push(i + l.start)
        }
        return { ...l, items }
      })
    }
  }, [listRef])
  return (
    <div onWheel={onWheel} onScrollCapture={(e) => e.preventDefault()} style={{ height: '300px', width: '300px', backgroundColor: 'red', display: 'flex', flexDirection: 'column' }}>
      <span>MultX: {values.multX}</span>
      <span>DeltaX: {values.x}</span>
      <span>MultY: {values.multY}</span>
      <span>DeltaY: {values.y}</span>
      <ul ref={listRef} style={{ height: '156px', overflow: 'hidden', position: 'relative' }}>
        {!list.items.length ? (
          <li>test</li>
        ) : (
          list.items.map((i, ix) => (<li style={{ position: 'relative', top: list.offset }} key={ix}>{i}</li>))
        )}
      </ul>
    </div>
  )
}

const getScroll = (e) => {
  let multX = 1, multY = 1
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    multX = multY = 20 //parseFloat(window.getComputedStyle(e.target).lineHeight)
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    const view = getViewport()
    multX = view.clientWidth
    multY = view.clientHeight
  }
  return { multX, multY, x: e.deltaX * multX, y: e.deltaY * multY }
}

const getViewport = () =>
  document.compatMode === 'BackCompat' ? document.querySelector('body') : document.documentElement

export const ScrollTest = (): ReactElement => {
  return <FakeScroll/>
}
