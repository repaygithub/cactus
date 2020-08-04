import { render } from '@testing-library/react'
import React, { ReactElement } from 'react'

import AppRoot, { FeatureFlag, useFeatureFlags, withFeatureFlags } from '../src/index'

describe('feature flags', (): void => {
  test('feature flags context object is optional on top level component', (): void => {
    expect((): void => {
      render(
        <AppRoot>
          <span>Anything</span>
        </AppRoot>
      )
    }).not.toThrow()
  })

  describe('useFeatureFlags()', (): void => {
    test('returns all false when no context', (): void => {
      const Random = (): ReactElement => {
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

    test('returns array of boolean values for feature flags requested', (): void => {
      const Random = (): ReactElement => {
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

    test('returns false when requested key is undefined', (): void => {
      const Random = (): ReactElement => {
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

  describe('withFeatureFlags()', (): void => {
    test('provides all props as false when no feature flags provided', (): void => {
      const Random = (props: any): ReactElement => {
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

    test('adds props for matching requested feature keys', (): void => {
      const Random = (props: any): ReactElement => {
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

  describe('<FeatureFlag />', (): void => {
    test('provides all props as false when no feature flags provided by root', (): void => {
      const TestComp = (): ReactElement => {
        return (
          <FeatureFlag feature="option_a">
            {(enabled): ReactElement =>
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

    test('allows rendering based on provided flags', (): void => {
      const TestComp = (): ReactElement => {
        return (
          <FeatureFlag feature="featureA">
            {(enabled): ReactElement =>
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
