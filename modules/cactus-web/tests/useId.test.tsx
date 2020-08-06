import { render } from '@testing-library/react'
import * as React from 'react'

import { useId } from '../src/index'

describe('useId()', (): void => {
  test('maintains same id on rerender', (): void => {
    const Something = ({ secondRender }: { secondRender?: boolean }): React.ReactElement => {
      const id = useId()
      return (
        <span id={id} data-testid="find-me">
          {secondRender}
        </span>
      )
    }

    const { rerender, getByTestId } = render(<Something />)
    const firstRenderId = getByTestId('find-me').id
    rerender(<Something secondRender />)
    const secondRenderId = getByTestId('find-me').id
    expect(firstRenderId).toBe(secondRenderId)
  })
})
