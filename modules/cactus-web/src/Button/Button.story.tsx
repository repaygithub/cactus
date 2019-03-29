import React from 'react'
import { storiesOf } from '@storybook/react'
import Button from './Button'

storiesOf('Button', module)
  .add('Basic Usage', () => <Button>A Button</Button>)
  .add('Using Variants', () => <Button variant="action">A Button</Button>)
