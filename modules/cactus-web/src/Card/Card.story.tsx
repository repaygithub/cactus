import React from 'react'

import { Box, Card } from '../'
import { SPACE, Story } from '../helpers/storybook'

export default {
  title: 'Card',
  component: Card,
} as const

interface Content {
  title: string
  subtitle: string
  totalAmount: string
  date: number
  minAmount: string
}

const BaseComponent: Story<typeof Card, Content> = ({
  title,
  subtitle,
  totalAmount,
  date,
  minAmount,
  ...args
}) => {
  return (
    <Card margin="30px" {...args}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <h4 style={{ margin: '0 0 8px', fontWeight: 400, fontSize: '12px' }}>{subtitle}</h4>

      <table style={{ fontSize: '15px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <Box as="th" style={{ textAlign: 'left', padding: '4px 60px 4px 0', fontSize: '12px' }}>
              Total Amount Due
            </Box>
            <td>
              <span style={{ textAlign: 'right', fontWeight: 600, fontSize: '25.92px' }}>
                {totalAmount}
              </span>
            </td>
          </tr>

          <tr>
            <th style={{ textAlign: 'left', fontWeight: 'normal', fontSize: '12px' }}>Due Date</th>
            <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '12px' }}>
              {new Date(date).toLocaleDateString()}
            </td>
          </tr>

          <tr>
            <th style={{ textAlign: 'left', fontWeight: 'normal', fontSize: '12px' }}>
              Minimum Amount Due
            </th>
            <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '12px' }}>{minAmount}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

interface BasicArgs extends Omit<Content, 'title'> {
  withShadow: string
  noShadow: string
}
export const BasicUsage: Story<typeof Card, BasicArgs> = ({ withShadow, noShadow, ...args }) => (
  <div>
    <BaseComponent {...args} useBoxShadow title={withShadow} />
    <BaseComponent {...args} title={noShadow} />
  </div>
)
BasicUsage.argTypes = {
  padding: SPACE,
  paddingX: SPACE,
  paddingY: SPACE,
  withShadow: { name: 'shadow card title' },
  noShadow: { name: 'shadowless card title' },
  date: { control: 'date' },
}
BasicUsage.args = {
  withShadow: 'With Shadows on',
  noShadow: 'With Shadows off',
  subtitle: 'Subtitle',
  totalAmount: '$350.20',
  date: new Date(2020, 9, 5).valueOf(),
  minAmount: '$127.00',
  useBoxShadow: false,
}

export const NestedCards: Story<typeof Card> = (args) => (
  <Card {...args}>
    Card 1
    <Card {...args}>
      Card 2<Card {...args}>Card 3</Card>
    </Card>
  </Card>
)
