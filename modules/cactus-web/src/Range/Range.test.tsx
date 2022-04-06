import React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { Range } from '../'

// NOTE: We can't actually test behavior because it looks like the Node/Jest
// version doesn't respond to keyboard commands, and we can't use the mouse.

describe('component: Range', () => {
  test('should pass style props to container & other props to input', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = renderWithTheme(
      <Range
        ref={ref}
        name="Quinn"
        aria-label="Slider"
        className="jerry"
        style={{ paddingBottom: '3px' }}
        marginRight={3}
        width="350px"
        height="60px"
        flexGrow="2"
      />
    )
    expect(getByLabelText('Slider')).toBe(ref.current)
    expect(ref.current).toHaveAttribute('name', 'Quinn')
    const wrapper = ref.current?.parentElement
    expect(wrapper).toHaveClass('jerry')
    expect(wrapper).toHaveStyle({
      paddingBottom: '3px',
      marginRight: '8px',
      width: '350px',
      height: '60px',
      flexGrow: '2',
    })
  })

  test('should support range props', () => {
    const { getByLabelText } = renderWithTheme(
      <Range aria-label="Arturo" min={14} max="42" step={7} defaultValue="28" />
    )
    const input = getByLabelText('Arturo')
    expect(input).toHaveAttribute('min', '14')
    expect(input).toHaveAttribute('max', '42')
    expect(input).toHaveAttribute('step', '7')
    expect(input).toHaveValue('28')
  })
})
