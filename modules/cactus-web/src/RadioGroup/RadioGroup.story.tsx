import React from 'react'

import { Flex, RadioGroup } from '../'
import { FIELD_ARGS, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'RadioGroup',
  component: RadioGroup,
  argTypes: {
    required: HIDE_CONTROL,
    value: HIDE_CONTROL,
    defaultValue: HIDE_CONTROL,
    ...FIELD_ARGS,
  },
} as const

type GroupStory = Story<typeof RadioGroup, { buttonLabel: string }>
export const BasicUsage: GroupStory = ({ buttonLabel, ...args }) => (
  <RadioGroup id="my-id" {...args}>
    <RadioGroup.Button label="That's right" value="right" />
    <RadioGroup.Button disabled label="That's wrong" value="left" />
    <RadioGroup.Button label={buttonLabel} value="center" />
  </RadioGroup>
)
BasicUsage.args = {
  label: 'A Label',
  disabled: false,
  tooltip: 'Here there be radio buttons',
  autoTooltip: true,
  name: 'radios',
  buttonLabel: 'That is...',
}
BasicUsage.parameters = { cactus: { overrides: { maxWidth: '500px' } } }

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
      <RadioGroup name="youAreGroupThree" label={<em>Follower</em>} required onChange={noop} m={0}>
        <RadioGroup.Button checked={value === ''} label="Zen" value="" />
        <RadioGroup.Button checked={value === 'strong'} label="Confident" value="strong" />
        <RadioGroup.Button checked={value === 'ladybug'} label="Miraculous" value="ladybug" />
      </RadioGroup>
    </Flex>
  )
}
WithValues.parameters = { controls: { disable: true } }
const noop = () => undefined // Fix propTypes warning.

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
WithDefaultValues.parameters = { controls: { disable: true } }
