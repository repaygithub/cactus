import React from 'react'

import { Preview } from '../'

export default {
  title: 'Preview',
  component: Preview,
  parameters: { controls: { disable: true } },
} as const

const IMAGES = [
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg',
  'http://placekitten.com/400/450',
  'http://placekitten.com/450/250',
  'http://placekitten.com/250',
  'http://placekitten.com/600/300',
  'http://placekitten.com/1250/700',
]

export const BasicUsage = (): React.ReactElement => <Preview images={IMAGES} />

export const FromChildren = (): React.ReactElement => (
  <Preview>
    {IMAGES.map((src, ix) => (
      <img src={src} key={ix} alt={ix === 0 ? 'Repay Logo' : `Cute kitten number ${ix}`} />
    ))}
  </Preview>
)

FromChildren.parameters = { storyshots: false }
