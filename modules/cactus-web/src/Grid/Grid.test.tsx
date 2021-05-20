import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Grid from './Grid'

describe('component: Grid', (): void => {
  test('should render extraLarge viewport design', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Grid justify="center">
          <Grid.Item tiny={4} extraLarge={2} data-testid="gridItem" />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
        </Grid>
      </StyleProvider>
    )

    const gridItem = getByTestId('gridItem')
    const styles = window.getComputedStyle(gridItem)
    expect(styles.width).toBe('calc(33.33333333333333% - 16px)')
  })

  test('should render tiny viewport design', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Grid justify="end">
          <Grid.Item tiny={3} data-testid="gridItem" />
          <Grid.Item tiny={3} />
          <Grid.Item tiny={3} />
          <Grid.Item tiny={3} />
        </Grid>
      </StyleProvider>
    )

    const gridItem = getByTestId('gridItem')
    const styles = window.getComputedStyle(gridItem)
    expect(styles.width).toBe('calc(25% - 16px)')
  })

  test('breakpoint styles should match larger screen sizes if their breakpoint style is not defined', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Grid>
          <Grid.Item tiny={3} small={6} data-testid="gridItem" />
          <Grid.Item tiny={3} small={6} />
          <Grid.Item tiny={3} small={6} />
          <Grid.Item tiny={3} small={6} />
        </Grid>
      </StyleProvider>
    )

    const gridItem = getByTestId('gridItem')
    const styles = window.getComputedStyle(gridItem)
    expect(styles.width).toBe('calc(25% - 16px)')
  })
})
