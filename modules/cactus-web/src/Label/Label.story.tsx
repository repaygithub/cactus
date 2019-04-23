import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import Label from './Label'

const labelStories = storiesOf('Label', module)

labelStories.add('Basic Usage', () => <Label>{text('label text', 'A Label')}</Label>)
