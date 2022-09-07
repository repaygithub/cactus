import { act, render } from '@testing-library/react'
import React from 'react'

import useControllableValue from '../useControllableValue'
import { SyncDispatch } from '../useRefState'

interface Props {
  value?: string
  num?: number
}

// In reality you should never change the "controlled-ness" of a prop,
// but doing so in these tests is a convenient way to illustrate behavior.
describe('`useControllableValue` hook', () => {
  test('uncontrolled to controlled', () => {
    let value = 'initial'
    let setValue: SyncDispatch<string> = () => ''

    const Component = (props: Props) => {
      ;[value, setValue] = useControllableValue(props, 'value', 'first')
      return null
    }
    const { rerender } = render(<Component />)
    expect(value).toBe('first')

    act(() => {
      expect(setValue((s) => `+${s}`)).toBe('+first')
    })
    expect(value).toBe('+first')

    rerender(<Component value="testing" />)
    expect(value).toBe('testing')
    act(() => {
      expect(setValue('bad')).toBe('bad')
    })
    expect(value).toBe('testing')
  })

  test('uncontrolled to controlled with normalizer', () => {
    let value = NaN
    let setValue: SyncDispatch<number> = () => NaN

    const norm = (p: Props, s: number) => p.num ?? (p.value?.length || 1) * s
    const Component = (props: Props) => {
      ;[value, setValue] = useControllableValue(props, norm, 21)
      return null
    }
    const { rerender } = render(<Component />)
    expect(value).toBe(21)

    act(() => {
      expect(setValue(14)).toBe(14)
    })
    expect(value).toBe(14)

    rerender(<Component value="hey" />)
    expect(value).toBe(42)
    act(() => {
      expect(setValue(2)).toBe(2)
    })
    expect(value).toBe(6)
    // Normally you'd never want a normalizer that modifies the existing state
    // just by rendering, but it works well to illustrate when & how it's called.
    rerender(<Component value="hey" />)
    expect(value).toBe(18)

    rerender(<Component value="hey" num={42} />)
    expect(value).toBe(42)
  })

  test('controlled to uncontrolled', () => {
    let value = ''
    let setValue: SyncDispatch<string, void> = () => ''

    const reducer = (x: string) => `-${x}`
    const Component = (props: Props) => {
      ;[value, setValue] = useControllableValue(props, 'value', reducer, 'hello')
      return null
    }
    const { rerender } = render(<Component value="goodbye" />)
    expect(value).toBe('goodbye')

    act(() => {
      expect(setValue()).toBe('-goodbye')
    })
    expect(value).toBe('goodbye')

    rerender(<Component />)
    expect(value).toBe('goodbye')
    act(() => {
      expect(setValue()).toBe('-goodbye')
    })
    expect(value).toBe('-goodbye')
  })
})

// The underlying logic is tested in the `useRefState` tests, so we don't need to
// write actual test cases for these; but we still want to cover the type checks.
/* eslint-disable @typescript-eslint/no-unused-vars */

// useState is covered sufficiently in tests above.
// useReducer with key & initial arg is covered in the test above

const useReducerWithInitializerFunc = () => {
  const props: { flag?: boolean } = {}
  const reducer = (x: boolean, a: string) => !x && a.length > 7
  const init = (x: string) => x.length < 2
  const [value, setValue] = useControllableValue(props, 'flag', reducer, 'seven', init)
  const bool: boolean = value
  setValue('hey')
  // @ts-expect-error
  const s: string = value
  // @ts-expect-error
  setValue(undefined)
  // @ts-expect-error
  setValue(false)
  // @ts-expect-error
  setValue(() => true)
}

const useReducerWithNormalizerAndInitialArg = () => {
  const props: { flag?: boolean } = {}
  const norm = (p: typeof props, s: boolean) => s
  const reducer = (x: boolean, a: string) => !x && a.length > 7
  const [value, setValue] = useControllableValue(props, norm, reducer, false)
  const bool: boolean = value
  setValue('hey')
  // @ts-expect-error
  const s: string = value
  // @ts-expect-error
  setValue(undefined)
  // @ts-expect-error
  setValue(false)
  // @ts-expect-error
  setValue(() => true)
}

const useReducerWithNormalizerAndInitializerFunc = () => {
  const props: { flag?: boolean } = {}
  const norm = (p: typeof props, s: boolean) => s
  const reducer = (x: boolean, a: string) => !x && a.length > 7
  const init = (x: string) => x.length < 2
  const [value, setValue] = useControllableValue(props, norm, reducer, 'seven', init)
  const bool: boolean = value
  setValue('hey')
  // @ts-expect-error
  const s: string = value
  // @ts-expect-error
  setValue(undefined)
  // @ts-expect-error
  setValue(false)
  // @ts-expect-error
  setValue(() => true)
}
