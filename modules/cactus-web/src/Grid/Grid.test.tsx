import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '@repay/cactus-web'
import Grid from './Grid'

afterEach(cleanup)

describe('component: Grid', () => {
  test('should render extraLarge viewport design', () => {
    const { container } = render(
      <StyleProvider>
        <Grid>
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
          <Grid.Item tiny={4} extraLarge={2} />
        </Grid>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render tiny viewport design', () => {
    const { container } = render(
      <StyleProvider>
        <Grid>
          <Grid.Item tiny={3} />
          <Grid.Item tiny={3} />
          <Grid.Item tiny={3} />
          <Grid.Item tiny={3} />
        </Grid>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('breakpoint styles should match larger screen sizes if their breakpoint style is not defined', () => {
    const { container } = render(
      <StyleProvider>
        <Grid>
          <Grid.Item tiny={3} small={6} />
          <Grid.Item tiny={3} small={6} />
          <Grid.Item tiny={3} small={6} />
          <Grid.Item tiny={3} small={6} />
        </Grid>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
