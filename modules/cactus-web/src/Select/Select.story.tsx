import { DescriptiveLocation } from '@repay/cactus-icons'
import { Page } from 'puppeteer'
import React from 'react'

import { Select } from '../'
import { Action, actions, HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'
import arizonaCities from '../storySupport/arizonaCities'
import { SelectValueType } from './Select'

const defaultMultiValue = arizonaCities.slice(6, 15).reverse()

const disabledOptions = [
  { label: "You can't select me", value: 0, disabled: true },
  { label: "Can't select me either", value: 1, disabled: true },
  { label: "I'm up for grabs", value: 2 },
  { label: 'Pick me pick me', value: [3] },
  { label: 'Nope', value: 4, disabled: true },
  { label: '', value: undefined },
  { label: 'Yep', value: { complex: 5 } },
]

export default {
  title: 'Cactus Web/Components/Select',
  component: Select,
  argTypes: {
    options: HIDE_CONTROL,
    id: HIDE_CONTROL,
    value: HIDE_CONTROL,
    className: HIDE_CONTROL,
    matchNotFoundText: STRING,
    extraLabel: STRING,
    noOptionsText: STRING,
    placeholder: STRING,
    status: { options: ['success', 'warning', 'error'] },
  },
  args: {
    id: 'select',
    name: 'select',
    disabled: false,
    multiple: false,
    comboBox: false,
    canCreateOption: true,
  },
  parameters: { docsPath: 'Select/Select.mdx', cactus: { overrides: { maxWidth: '500px' } } },
} as const

type ChangeArg = { onChange: Action<React.ChangeEvent<{ value: SelectValueType | null }>> }
type BasicStory = Story<typeof Select, { showOptions: boolean }>

export const BasicUsage: BasicStory = ({ showOptions, options, ...args }) => (
  <Select {...args} options={showOptions ? options : []} />
)
BasicUsage.argTypes = { options: { control: 'array' }, margin: SPACE }
BasicUsage.args = { options: ['name', 'other', 'three'], showOptions: true, margin: '2' }

export const CollisionsInLargeContainer: BasicStory = ({ showOptions, options, ...args }) => (
  <React.Fragment>
    <Select {...args} options={showOptions ? options : []} />
    <div style={{ position: 'absolute', left: '20px', top: '20px' }}>
      Scroll down and to the right
    </div>
  </React.Fragment>
)
CollisionsInLargeContainer.argTypes = {
  options: { control: 'array' },
  margin: SPACE,
  ...actions('onChange', 'onBlur', 'onFocus'),
}
CollisionsInLargeContainer.args = {
  options: ['name', 'other', 'three'],
  showOptions: true,
  margin: '2',
}
CollisionsInLargeContainer.storyName = 'Collisions in an over-sized container'
CollisionsInLargeContainer.parameters = {
  cactus: {
    overrides: {
      height: '220vh',
      width: '220vw',
      maxWidth: '220vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  storyshots: false,
}

export const LongListOfOptions: Story<typeof Select, ChangeArg> = (args) => {
  const [value, setValue] = React.useState<SelectValueType>(arizonaCities[6])
  return (
    <Select
      {...args}
      options={arizonaCities}
      onChange={args.onChange.wrap(setValue, true)}
      value={value}
    />
  )
}
LongListOfOptions.storyName = 'Long list of options'
LongListOfOptions.argTypes = actions('onChange', 'onBlur', 'onFocus')

export const LongOptionLabels: Story<typeof Select, ChangeArg> = (args) => {
  const [value, setValue] = React.useState<SelectValueType>('')
  return (
    <div style={{ width: '194px' }}>
      <Select {...args} onChange={args.onChange.wrap(setValue, true)} value={value}>
        <option value="long-option">This should be the longest option available</option>
        <option value="another-option">Here is another option</option>
        <option value="the-last-option">One more option</option>
      </Select>
    </div>
  )
}
LongOptionLabels.storyName = 'Long option labels'
LongOptionLabels.parameters = { storyshots: false }
LongOptionLabels.argTypes = actions('onChange', 'onBlur', 'onFocus')
export const WithMultiselect: Story<typeof Select, ChangeArg> = (args) => {
  const [value, setValue] = React.useState<SelectValueType>(defaultMultiValue)
  return (
    <Select {...args} onChange={args.onChange.wrap(setValue, true)} value={value}>
      {arizonaCities.map((city, ix) => (
        <option key={ix} value={city}>
          <DescriptiveLocation /> {city}
        </option>
      ))}
    </Select>
  )
}
WithMultiselect.args = { multiple: true }
WithMultiselect.argTypes = actions('onChange', 'onBlur', 'onFocus')

type OptionAl = ChangeArg & { showOptions: boolean }
export const WithComboBox: Story<typeof Select, OptionAl> = ({
  showOptions,
  onChange,
  ...args
}) => {
  const [value, setValue] = React.useState<SelectValueType>(null)
  return (
    <Select {...args} onChange={onChange.wrap(setValue, true)} value={value}>
      {showOptions &&
        arizonaCities.map((city, ix) => (
          <Select.Option key={ix} value={city} altText={city.toLowerCase()}>
            <DescriptiveLocation iconSize="medium" /> {city}
          </Select.Option>
        ))}
    </Select>
  )
}
WithComboBox.args = { showOptions: true, comboBox: true }
WithComboBox.storyName = 'With ComboBox'
WithComboBox.parameters = { storyshots: false }
WithComboBox.argTypes = actions('onChange', 'onBlur', 'onFocus')

export const WithMultiSelectComboBox: Story<typeof Select, ChangeArg> = (args) => {
  const [value, setValue] = React.useState<SelectValueType>([])
  return (
    <Select
      {...args}
      options={arizonaCities}
      onChange={args.onChange.wrap(setValue, true)}
      value={value}
    />
  )
}
WithMultiSelectComboBox.args = { comboBox: true, multiple: true }
WithMultiSelectComboBox.storyName = 'With MultiSelect ComboBox'
WithMultiSelectComboBox.parameters = {
  storyshots: false,
}
WithMultiSelectComboBox.argTypes = actions('onChange', 'onBlur', 'onFocus')

export const WithDisabledOptions: Story<typeof Select, ChangeArg> = (args) => {
  const [value, setValue] = React.useState<SelectValueType>([])
  return (
    <Select
      {...args}
      options={disabledOptions}
      onChange={args.onChange.wrap(setValue, true)}
      value={value}
    />
  )
}
WithDisabledOptions.storyName = 'With Disabled Options'
WithDisabledOptions.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('button[name="select"]')
  },
}
WithDisabledOptions.argTypes = actions('onChange', 'onBlur', 'onFocus')
