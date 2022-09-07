import { act, render } from '@testing-library/react'
import React from 'react'

import useRefState from '../useRefState'

interface TestCase {
  expected: unknown
  update: () => any
}

interface TestData {
  initialValue: unknown
  ref: React.RefObject<any>
}

type HookResult = [TestData, ...TestCase[]]

const runTestCases = (useTest: () => HookResult) => {
  let $testCases: HookResult = null as any
  const Component = () => {
    $testCases = useTest()
    return <div>{$testCases[0].ref.current}</div>
  }
  const { container } = render(<Component />)
  const [{ ref, initialValue }, ...testCases] = $testCases
  expect(ref.current).toBe(initialValue)
  for (const { expected, update } of testCases) {
    act(() => {
      // Show that the update happens synchronously.
      expect(update()).toBe(expected)
      expect(ref.current).toBe(expected)
    })
    expect(container).toHaveTextContent(String(expected ?? ''))
  }
}

describe('`useRefState` hook', () => {
  // I'm going to put some Typescript errors after the return values so they won't affect the test.
  /* eslint-disable no-unreachable */

  describe('when used like `useState`', () => {
    test('with no initializer', () => {
      runTestCases(function useTest() {
        const ref = useRefState<string>()
        const funcAction = (x: string | undefined) => `${x}-suffix`
        return [
          { ref, initialValue: undefined },
          { expected: undefined, update: () => ref.setState(undefined) },
          { expected: 'undefined-suffix', update: () => ref.setState(funcAction) },
          { expected: 'something', update: () => ref.setState('something') },
          { expected: 'something-suffix', update: () => ref.setState(funcAction) },
        ]
        // @ts-expect-error
        ref.setState(42)
        // @ts-expect-error
        ref.setState((x: number) => x.toString())
        // @ts-expect-error
        ref.setState((x: string | undefined) => parseInt(x))
        // @ts-expect-error
        ref.setState((x: string) => x)
      })
    })

    test('with initial value', () => {
      runTestCases(function useTest() {
        const ref = useRefState('nope')
        const funcAction = (x: string) => `${x}-suffix`
        return [
          { ref, initialValue: 'nope' },
          { expected: 'nope-suffix', update: () => ref.setState(funcAction) },
          { expected: 'something', update: () => ref.setState('something') },
        ]
        // @ts-expect-error
        ref.setState(undefined)
        // @ts-expect-error
        ref.setState(42)
      })
    })

    test('with initializer function', () => {
      const initial = Math.random()

      runTestCases(function useTest() {
        const ref = useRefState(() => initial)
        const funcAction = (x: number) => x + 2
        return [
          { ref, initialValue: initial },
          { expected: initial + 2, update: () => ref.setState(funcAction) },
          { expected: 4242564, update: () => ref.setState(4242564) },
        ]
        // @ts-expect-error
        ref.setState(undefined)
        // @ts-expect-error
        ref.setState('testing')
      })
    })
  })

  describe('when used like `useReducer`', () => {
    describe('with void action', () => {
      test('with no initializer', () => {
        runTestCases(function useTest() {
          const ref = useRefState<number>((x: number | undefined) => (x === undefined ? -1 : -x))
          return [
            { ref, initialValue: undefined },
            { expected: -1, update: () => ref.setState() },
            { expected: 1, update: () => ref.setState() },
          ]
          // @ts-expect-error
          ref.setState(10)
          // @ts-expect-error
          ref.setState((x: any) => x)
        })
      })

      test('with initial value', () => {
        runTestCases(function useTest() {
          const ref = useRefState((x: number) => x / 2 + 1, 42)
          return [
            { ref, initialValue: 42 },
            { expected: 22, update: () => ref.setState() },
            { expected: 12, update: () => ref.setState() },
          ]
          // @ts-expect-error
          ref.setState(10)
          // @ts-expect-error
          ref.setState((x: any) => x)
        })
      })

      test('with initializer function', () => {
        runTestCases(function useTest() {
          const ref = useRefState((x: number) => -x + 3, '17.5', parseInt)
          return [
            { ref, initialValue: 17 },
            { expected: -14, update: () => ref.setState() },
            { expected: 17, update: () => ref.setState() },
          ]
          // @ts-expect-error
          ref.setState(10)
          // @ts-expect-error
          ref.setState((x: any) => x)
        })
      })
    })

    describe('with concrete action', () => {
      test('with no initializer', () => {
        runTestCases(function useTest() {
          const ref = useRefState<number, boolean>((x, y) => {
            if (x === undefined) return Number(y)
            return y ? x + 1 : x - 1
          })
          return [
            { ref, initialValue: undefined },
            { expected: 1, update: () => ref.setState(true) },
            { expected: 2, update: () => ref.setState(true) },
            { expected: 1, update: () => ref.setState(false) },
          ]
          // @ts-expect-error
          ref.setState(10)
          // @ts-expect-error
          ref.setState((x: any) => x)
        })
      })

      test('with initial value', () => {
        runTestCases(function useTest() {
          const ref = useRefState(
            (x: string, y: number) =>
              Array(y)
                .fill(x[y] || 'x')
                .join('q'),
            'hello'
          )
          return [
            { ref, initialValue: 'hello' },
            { expected: 'lql', update: () => ref.setState(2) },
            { expected: 'xqxqxqx', update: () => ref.setState(4) },
            { expected: 'q', update: () => ref.setState(1) },
          ]
          // @ts-expect-error
          ref.setState('10')
          // @ts-expect-error
          ref.setState((x: any) => x)
        })
      })

      test('with initializer function', () => {
        runTestCases(function useTest() {
          const ref = useRefState(
            (x: number, y: boolean) => (y ? x + 10 : x / 2),
            { value: 7 },
            (o) => o.value
          )
          return [
            { ref, initialValue: 7 },
            { expected: 17, update: () => ref.setState(true) },
            { expected: 27, update: () => ref.setState(true) },
            { expected: 13.5, update: () => ref.setState(false) },
          ]
          // @ts-expect-error
          ref.setState(10)
          // @ts-expect-error
          ref.setState((x: any) => x)
        })
      })
    })
  })
})
