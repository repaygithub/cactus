import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Grid from './Grid'

describe('component: Grid', () => {
  test('should render extraLarge viewport design', () => {
    const { getByTestId } = renderWithTheme(
      <Grid justify="center">
        <Grid.Item tiny={4} extraLarge={2} data-testid="gridItem" />
        <Grid.Item tiny={4} extraLarge={2} />
        <Grid.Item tiny={4} extraLarge={2} />
        <Grid.Item tiny={4} extraLarge={2} />
        <Grid.Item tiny={4} extraLarge={2} />
        <Grid.Item tiny={4} extraLarge={2} />
      </Grid>
    )

    const gridItem = getByTestId('gridItem')
    const styles = window.getComputedStyle(gridItem)
    expect(styles.width).toBe('calc(33.33333333333333% - 16px)')
  })

  test('should render tiny viewport design', () => {
    const { getByTestId } = renderWithTheme(
      <Grid justify="end">
        <Grid.Item tiny={3} data-testid="gridItem" />
        <Grid.Item tiny={3} />
        <Grid.Item tiny={3} />
        <Grid.Item tiny={3} />
      </Grid>
    )

    const gridItem = getByTestId('gridItem')
    const styles = window.getComputedStyle(gridItem)
    expect(styles.width).toBe('calc(25% - 16px)')
  })

  test('breakpoint styles should match larger screen sizes if their breakpoint style is not defined', () => {
    const { getByTestId } = renderWithTheme(
      <Grid>
        <Grid.Item tiny={3} small={6} data-testid="gridItem" />
        <Grid.Item tiny={3} small={6} />
        <Grid.Item tiny={3} small={6} />
        <Grid.Item tiny={3} small={6} />
      </Grid>
    )

    const gridItem = getByTestId('gridItem')
    const styles = window.getComputedStyle(gridItem)
    expect(styles.width).toBe('calc(25% - 16px)')
  })
})
