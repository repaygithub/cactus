import React from 'react'
import { margin, MarginProps, shadow, ShadowProps } from 'styled-system'

import { Flex } from '../src'
import { withStyles } from '../src/helpers/styled'
import { ScreenSizeContext, SIZES } from '../src/ScreenSizeProvider/ScreenSizeProvider'
import renderWithTheme from './helpers/renderWithTheme'

type Styles = MarginProps & ShadowProps

const PropRenderer = ({ className, 'data-testId': id, ...props }: any) => {
  return (
    <div className={className} data-testid={id}>
      {JSON.stringify(props)}
    </div>
  )
}

// These tests are both to ensure correct functionality, as well as to fail if
// the 3rd party libs change some of the internals the inline parser relies on.
describe('styled-components + inline responsive styles', () => {
  test('should combine styles from multiple sources (Box, Flex, `style` prop)', () => {
    const { getByTestId } = renderWithTheme(
      <Flex
        data-testid="src"
        m={3}
        flexDirection="column"
        style={{ padding: '10px', flexDirection: 'row' }}
      />
    )
    expect(getByTestId('src')).toHaveStyle({
      flexDirection: 'column',
      margin: '8px',
      padding: '10px',
    })
  })

  test('should correctly parse responsive styles', () => {
    const margins = { mt: [3], ml: [1, 2], mb: [4, 5, 6], mr: ['1em', null, '3vw', '4%'] }
    const { getByTestId, rerender } = renderWithTheme(
      <ScreenSizeContext.Provider value={SIZES.tiny}>
        <Flex data-testid="responsive" {...margins} />
      </ScreenSizeContext.Provider>
    )
    const flex = getByTestId('responsive')
    expect(flex).toHaveStyle({
      marginTop: '8px',
      marginLeft: '2px',
      marginBottom: '16px',
      marginRight: '1em',
    })

    rerender(
      <ScreenSizeContext.Provider value={SIZES.small}>
        <Flex data-testid="responsive" {...margins} />
      </ScreenSizeContext.Provider>
    )
    expect(flex).toHaveStyle({
      marginTop: '8px',
      marginLeft: '4px',
      marginBottom: '24px',
      marginRight: '1em',
    })

    rerender(
      <ScreenSizeContext.Provider value={SIZES.medium}>
        <Flex data-testid="responsive" {...margins} />
      </ScreenSizeContext.Provider>
    )
    expect(flex).toHaveStyle({
      marginTop: '8px',
      marginLeft: '4px',
      marginBottom: '32px',
      marginRight: '3vw',
    })

    rerender(
      <ScreenSizeContext.Provider value={SIZES.large}>
        <Flex data-testid="responsive" {...margins} />
      </ScreenSizeContext.Provider>
    )
    expect(flex).toHaveStyle({
      marginTop: '8px',
      marginLeft: '4px',
      marginBottom: '32px',
      marginRight: '4%',
    })
  })

  test('should not be polymorphic when `as` is specified', () => {
    const UnPoly = withStyles('span', { as: PropRenderer, styles: [margin, shadow] })<Styles>``
    // UnPoly isn't polymorphic so it doesn't process the flex styles...
    const { container, rerender } = renderWithTheme(
      <UnPoly as={Flex} flexWrap="nowrap" textShadow="small" />
    )
    expect(JSON.parse(container.textContent as string)).toEqual({
      flexWrap: 'nowrap',
      style: { textShadow: 'small' },
    })
    // ...but Flex IS polymorphic, so it DOES render the JSON.
    rerender(<Flex as={UnPoly} flexWrap="nowrap" textShadow="small" />)
    expect(JSON.parse(container.textContent as string)).toEqual({
      style: { flexWrap: 'nowrap', textShadow: 'small' },
    })
  })

  test('should correctly drop `transitiveProps`', () => {
    const opts = { transitiveProps: ['dropMe'], styles: [margin, shadow] }
    const Dropper = withStyles(PropRenderer, opts)<Styles>``
    const { container } = renderWithTheme(<Dropper dropMe="now" keepMe="always" />)
    expect(JSON.parse(container.textContent as string)).toEqual({ keepMe: 'always' })
  })

  test('should correctly keep `preserveProps`', () => {
    const opts = { preserveProps: ['margin'], styles: [margin, shadow] }
    const Keeper = withStyles(PropRenderer, opts)<Styles>``
    const { container } = renderWithTheme(<Keeper margin={[3, 4]} mt={1} />)
    expect(JSON.parse(container.textContent as string)).toEqual({
      margin: [3, 4],
      style: { margin: 16, marginTop: 2 },
    })
  })

  test('should have displayName when specified', () => {
    const Display1 = withStyles('div', { displayName: 'Argh' })``
    const Display2 = withStyles(Display1, {})``
    const Display3 = withStyles(PropRenderer, {})``
    expect(Display1.displayName).toBe('Argh')
    expect(Display2.displayName).toBe('Argh')
    // There's an auto-generated name, don't care what it is as long as it exists.
    expect(Display3.displayName).toBeTruthy()
  })

  test('should have custom class when specified', () => {
    const Custom = withStyles('div', { componentId: 'test-class' })``
    const { getByTestId } = renderWithTheme(<Custom data-testid="class" className="custom" />)
    expect(getByTestId('class')).toHaveClass('custom')
    expect(getByTestId('class')).toHaveClass('test-class')
  })
})
