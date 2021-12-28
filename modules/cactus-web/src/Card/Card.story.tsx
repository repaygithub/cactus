import React from 'react'
import styled from 'styled-components'

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

const Table = styled.table`
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  th {
    text-align: left;
    font-weight: 400;
  }
  th.total {
    padding-right: 55px;
    font-weight: 600;
  }
  td {
    text-align: right;
    font-weight: 600;
  }
  td.total {
    font-size: 25.92px;
  }
`

const BaseComponent: Story<typeof Card, Content> = ({
  title,
  subtitle,
  totalAmount,
  date,
  minAmount,
  ...args
}) => {
  return (
    <Card {...args}>
      <Box as="h2" margin="0">
        {title}
      </Box>
      <Box as="h4" margin="0 0 8px 0" fontWeight="400" fontSize="12px">
        {subtitle}
      </Box>

      <Table>
        <tbody>
          <tr>
            <th className="total">Total Amount Due</th>
            <td className="total">{totalAmount}</td>
          </tr>

          <tr>
            <th>Due Date</th>
            <td>{new Date(date).toLocaleDateString()}</td>
          </tr>

          <tr>
            <th>Minimum Amount Due</th>
            <td>{minAmount}</td>
          </tr>
        </tbody>
      </Table>
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
  margin: SPACE,
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
  margin: '30px',
  maxWidth: '500px',
}

export const NestedCards: Story<typeof Card> = (args) => (
  <Card {...args}>
    Card 1
    <Card {...args}>
      Card 2<Card {...args}>Card 3</Card>
    </Card>
  </Card>
)
