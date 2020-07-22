import { text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Label from './Label'

const labelStories = storiesOf('Label', module)

labelStories.add('Basic Usage', () => <Label>{text('label text', 'A Label')}</Label>)
