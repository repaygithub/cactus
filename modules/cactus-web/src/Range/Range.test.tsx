import { render } from '@testing-library/react'
import React from 'react'

import { Range, StyleProvider } from '../'

// NOTE: We can't actually test behavior because it looks like the Node/Jest
// version doesn't respond to keyboard commands, and we can't use the mouse.

describe('component: Range', () => {
  test('should pass style props to container & other props to input', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = render(
      <StyleProvider>
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
      </StyleProvider>
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
    const { getByLabelText } = render(
      <StyleProvider>
        <Range aria-label="Arturo" min={14} max="42" step={7} defaultValue="28" />
      </StyleProvider>
    )
    const input = getByLabelText('Arturo')
    expect(input).toHaveAttribute('min', '14')
    expect(input).toHaveAttribute('max', '42')
    expect(input).toHaveAttribute('step', '7')
    expect(input).toHaveValue('28')
  })
})
