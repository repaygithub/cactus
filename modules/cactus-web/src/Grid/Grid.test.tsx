import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Grid from './Grid'

describe('component: Grid', () => {
  describe('pseudo-flex mode', () => {
    // TODO So at the moment we can't actually test anything other than tiny,
    // because JSDOM apparently doesn't support interpreting media queries.
    // If we implement our own parser (see CACTUS-975) we may be able to use
    // ScreenSizeProvider in test mode to test other screen sizes.

    test('grid defaults', () => {
      const { getByTestId } = renderWithTheme(<Grid data-testid="grid" />)
      expect(getByTestId('grid')).toHaveStyle({
        // Inherited from Box:
        boxSizing: 'border-box',
        // Inherited from Flex:
        flexWrap: 'wrap',
        // Original to Grid:
        display: 'grid',
        gap: '16px',
        justifyItems: 'normal',
        width: '100%',
        gridTemplateColumns: 'repeat(12,minmax(1px,1fr))',
      })
    })

    test('screen size: tiny', () => {
      const { getByTestId } = renderWithTheme(
        <Grid>
          <Grid.Item tiny={6} small={3} data-testid="item" />
        </Grid>
      )
      expect(getByTestId('item')).toHaveStyle({ gridColumnEnd: 'span 6' })
    })
  })

  test('should render grid styles', () => {
    // JSDOM doesn't really interpret grid styles, so even though several of these
    // are invalid/conflicting, it shows that the styles are properly forwarded.
    const { getByTestId } = renderWithTheme(
      <Grid
        data-testid="grid"
        grid="test1"
        gridTemplate="test2"
        gridTemplateAreas="test3"
        rows="repeat(4,200px)"
        cols="1fr 3fr 50px"
        justifyItems="start"
        justifyContent="end"
        alignItems="stretch"
        alignContent="center"
        autoFlow="test4"
        autoRows="test5"
        autoCols="test6"
        rowGap="14px"
        colGap={5}
        width="500px"
      />
    )
    expect(getByTestId('grid')).toHaveStyle({
      display: 'grid',
      grid: 'test1',
      gridTemplate: 'test2',
      gridTemplateAreas: 'test3',
      gridTemplateRows: 'repeat(4,200px)',
      gridTemplateColumns: '1fr 3fr 50px',
      justifyItems: 'start',
      justifyContent: 'end',
      alignItems: 'stretch',
      alignContent: 'center',
      gridAutoFlow: 'test4',
      gridAutoRows: 'test5',
      gridAutoColumns: 'test6',
      rowGap: '14px',
      columnGap: '24px',
      // `width` isn't overridden properly, possibly because it's defined in Box...
      width: '100%',
    })
  })

  test('should render grid row/col shortcuts', () => {
    const { getByTestId } = renderWithTheme(<Grid data-testid="grid" rows={3} cols={7} />)
    expect(getByTestId('grid')).toHaveStyle({
      display: 'grid',
      gridTemplateRows: 'repeat(3,min-content)',
      gridTemplateColumns: 'repeat(7,1fr)',
    })
  })

  test('should render grid areas', () => {
    const { container } = renderWithTheme(
      <Grid
        rows="repeat(3, min-content)"
        cols="repeat(4, 1fr) 2fr"
        gridAreas={{
          big: '1/1/3/span 4',
          right: '1/5/span 3/6',
          bottom: '3/1/auto/-1',
        }}
      >
        <Grid.Item className="big" />
        <Grid.Item className="right" />
        <Grid.Item className="bottom" />
      </Grid>
    )
    expect(container.querySelector('.big')).toHaveStyle({ gridArea: '1/1/3/span 4' })
    expect(container.querySelector('.right')).toHaveStyle({ gridArea: '1/5/span 3/6' })
    expect(container.querySelector('.bottom')).toHaveStyle({ gridArea: '3/1/auto/-1' })
  })
})
