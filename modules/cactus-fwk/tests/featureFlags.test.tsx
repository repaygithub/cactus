import React from 'react'

import { render } from '@testing-library/react'
import AppRoot, { FeatureFlag, useFeatureFlags, withFeatureFlags } from '../src/index'

describe('feature flags', () => {
  test('feature flags context object is optional on top level component', () => {
    expect(() => {
      render(
        <AppRoot>
          <span>Anything</span>
        </AppRoot>
      )
    }).not.toThrow()
  })

  describe('useFeatureFlags()', () => {
    test('returns all false when no context', () => {
      const Random = () => {
        const [featureA, featureB] = useFeatureFlags('featureA', 'featureB')
        return (
          <span>
            featureA is {String(featureA)}, featureB is {String(featureB)}
          </span>
        )
      }

      const { container } = render(<Random />)

      expect(container).toHaveTextContent('featureA is false, featureB is false')
    })

    test('returns array of boolean values for feature flags requested', () => {
      const Random = () => {
        const [featureA, featureB] = useFeatureFlags('featureA', 'featureB')
        return (
          <span>
            featureA is {String(featureA)}, featureB is {String(featureB)}
          </span>
        )
      }

      const { container } = render(
        <AppRoot featureFlags={{ featureA: true, featureB: false }}>
          <Random />
        </AppRoot>
      )

      expect(container).toHaveTextContent('featureA is true, featureB is false')
    })

    test('returns false when requested key is undefined', () => {
      const Random = () => {
        const [featureA, featureB] = useFeatureFlags('featureA', 'featureB')
        return (
          <span>
            featureA is {String(featureA)}, featureB is {String(featureB)}
          </span>
        )
      }

      const { container } = render(
        <AppRoot featureFlags={{}}>
          <Random />
        </AppRoot>
      )

      expect(container).toHaveTextContent('featureA is false, featureB is false')
    })
  })

  describe('withFeatureFlags()', () => {
    test('provides all props as false when no feature flags provided', () => {
      const Random = (props: any) => {
        return (
          <span>
            featureA is {String(props.featureA)}, featureB is {String(props.featureB)}
          </span>
        )
      }
      const HasFeatureFlags = withFeatureFlags(['featureA', 'featureB'], Random)

      const { container } = render(<HasFeatureFlags />)

      expect(container).toHaveTextContent('featureA is false, featureB is false')
    })

    test('adds props for matching requested feature keys', () => {
      const Random = (props: any) => {
        return (
          <span>
            featureA is {String(props.featureA)}, featureB is {String(props.featureB)}
          </span>
        )
      }
      const HasFeatureFlags = withFeatureFlags(['featureA', 'featureB', 'featureC'], Random)

      const { container } = render(
        <AppRoot featureFlags={{ featureA: true, featureB: false }}>
          <HasFeatureFlags />
        </AppRoot>
      )

      expect(container).toHaveTextContent('featureA is true, featureB is false')
    })
  })

  describe('<FeatureFlag />', () => {
    test('provides all props as false when no feature flags provided by root', () => {
      const TestComp = () => {
        return (
          <FeatureFlag feature="option_a">
            {enabled =>
              enabled ? (
                <span>Should not render this section of text</span>
              ) : (
                <span>Should be rendered</span>
              )
            }
          </FeatureFlag>
        )
      }

      const { container } = render(<TestComp />)

      expect(container).toHaveTextContent('Should be rendered')
    })

    test('allows rendering based on provided flags', () => {
      const TestComp = () => {
        return (
          <FeatureFlag feature="featureA">
            {enabled =>
              enabled ? (
                <span>This text is expected to render second.</span>
              ) : (
                <span>Should be rendered initially.</span>
              )
            }
          </FeatureFlag>
        )
      }

      const { container, rerender } = render(
        <AppRoot featureFlags={{ featureA: false }}>
          <TestComp />
        </AppRoot>
      )

      expect(container).toHaveTextContent('Should be rendered initially.')

      rerender(
        <AppRoot featureFlags={{ featureA: true }}>
          <TestComp />
        </AppRoot>
      )

      expect(container).toHaveTextContent('This text is expected to render second.')
    })
  })
})
