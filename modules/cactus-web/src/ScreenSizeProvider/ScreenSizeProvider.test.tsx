import * as React from 'react'

import { act, render } from '@testing-library/react'
import { ScreenSizeContext, ScreenSizeProvider, SIZES } from './ScreenSizeProvider'
import { StyleProvider } from '../StyleProvider/StyleProvider'

const Size: React.FC = (props) => {
  return (
    <ScreenSizeContext.Consumer>
      {(value) => <span>{value.toString()}</span>}
    </ScreenSizeContext.Consumer>
  )
}

interface MQ {
  minPx: number
  matches: boolean
  removeListener: (x: () => void) => void
  addListener: (x: () => void) => void
}

describe('component: ScreenSizeProvider', () => {
  const matchMedia = window.matchMedia

  const media = {
    queries: [] as MQ[],
    listener: () => {},
    setWidth: (x: number) => {},
  }

  const mockMedia = () => {
    const mock = jest.fn((query: string) => {
      const minPxMatch = query.match(/\d+/g)
      const result: MQ = {
        minPx: minPxMatch ? parseInt(minPxMatch[0]) : 0,
        matches: false,
        removeListener: (x: () => void) => {},
        addListener: (listener) => {
          media.listener = listener
        },
      }
      media.queries.push(result)
      return result
    })
    window.matchMedia = mock as any
    media.queries = [] as MQ[]
    media.setWidth = (width: number) => {
      for (const mq of media.queries) {
        mq.matches = width >= mq.minPx
      }
      act(media.listener)
    }
    return mock.mock
  }

  afterEach(() => {
    window.matchMedia = matchMedia
  })

  test('changing screen size', () => {
    const mock = mockMedia()

    const { container } = render(
      <StyleProvider>
        <ScreenSizeProvider>
          <Size />
        </ScreenSizeProvider>
      </StyleProvider>
    )

    expect(container).toHaveTextContent('tiny')
    expect(mock.calls).toEqual([
      ['screen and (min-width: 768px)'],
      ['screen and (min-width: 1024px)'],
      ['screen and (min-width: 1200px)'],
      ['screen and (min-width: 1440px)'],
    ])

    media.setWidth(767)
    expect(container).toHaveTextContent('tiny')
    media.setWidth(768)
    expect(container).toHaveTextContent('small')
    media.setWidth(1440)
    expect(container).toHaveTextContent('extraLarge')
    media.setWidth(1000)
    expect(container).toHaveTextContent('small')
    media.setWidth(1250)
    expect(container).toHaveTextContent('large')
    media.setWidth(1024)
    expect(container).toHaveTextContent('medium')
    media.setWidth(1200)
    expect(container).toHaveTextContent('large')
    media.setWidth(1199)
    expect(container).toHaveTextContent('medium')
  })

  test('size comparisons', () => {
    expect(SIZES.tiny < SIZES.small).toBe(true)
    expect(SIZES.tiny < SIZES.large).toBe(true)
    expect(SIZES.small < SIZES.large).toBe(true)
    expect(SIZES.large < SIZES.extraLarge).toBe(true)
    expect(SIZES.large > SIZES.small).toBe(true)

    expect(SIZES.tiny > SIZES.small).toBe(false)
    expect(SIZES.tiny > SIZES.large).toBe(false)
    expect(SIZES.small > SIZES.large).toBe(false)
    expect(SIZES.large > SIZES.extraLarge).toBe(false)
    expect(SIZES.large < SIZES.small).toBe(false)
  })
})
