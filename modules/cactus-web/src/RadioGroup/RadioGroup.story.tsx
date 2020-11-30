import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Flex from '../Flex/Flex'
import RadioGroup from './RadioGroup'

export default {
  title: 'RadioGroup',
  component: RadioGroup,
} as Meta
export const BasicUsage = (): React.ReactElement => (
  <RadioGroup
    id="my-id"
    name="you-are-group-one"
    label={text('label', 'A Label')}
    disabled={boolean('disabled', false)}
    onChange={(e: any) => console.log(`'${e.target.name}' changed: ${e.target.value}`)}
    onFocus={(e: any) => console.log(`'${e.target.value}' focused`)}
    onBlur={(e: any) => console.log(`'${e.target.value}' blurred`)}
    tooltip={text('tooltip', 'Here there be radio buttons')}
    error={text('error', '')}
    success={text('success', '')}
    warning={text('warning', '')}
    autoTooltip={boolean('autoTooltip', true)}
    disableTooltip={select('disableTooltip', [false, true, undefined], false)}
  >
    <RadioGroup.Button label="That's right" value="right" />
    <RadioGroup.Button disabled label="That's wrong" value="left" />
    <RadioGroup.Button label={text('button label', "That's...")} value="center" />
  </RadioGroup>
)

export const WithValues = (): React.ReactElement => {
  const [value, setValue] = React.useState<string>('strong')
  return (
    <Flex>
      <RadioGroup
        name="youAreGroupTwo"
        label="Controller"
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      >
        <RadioGroup.Button label="Empty" value="" />
        <RadioGroup.Button label={<sup>Strong</sup>} value="strong" />
        <RadioGroup.Button label="Fortunate" value="ladybug" />
      </RadioGroup>
      <RadioGroup name="youAreGroupThree" label={<em>Follower</em>} required>
        <RadioGroup.Button checked={value === ''} label="Zen" value="" />
        <RadioGroup.Button checked={value === 'strong'} label="Confident" value="strong" />
        <RadioGroup.Button checked={value === 'ladybug'} label="Miraculous" value="ladybug" />
      </RadioGroup>
    </Flex>
  )
}

export const WithDefaultValues = (): React.ReactElement => {
  const group = React.useRef<HTMLFormElement>(null)
  const button = React.useRef<HTMLFormElement>(null)
  return (
    <Flex>
      <form ref={group}>
        <RadioGroup name="youAreGroupFour" label="On Group" defaultValue="punny">
          <RadioGroup.Button label="Pining" value="sigh" />
          <RadioGroup.Button label="UnFortunate" value="catNoir" />
          <RadioGroup.Button label="Freedom" value="punny" />
        </RadioGroup>
        <button type="button" onClick={() => group.current?.reset()}>
          Reset
        </button>
      </form>
      <form ref={button}>
        <RadioGroup name="youAreGroupFive" label="On Button">
          <RadioGroup.Button label="Alone" value="sigh" />
          <RadioGroup.Button label="Destruction" value="catNoir" />
          <RadioGroup.Button defaultChecked label="Unleashed" value="punny" />
        </RadioGroup>
        <button type="button" onClick={() => button.current?.reset()}>
          Reset
        </button>
      </form>
    </Flex>
  )
}
