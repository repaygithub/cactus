import { boolean, date, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Box from '../Box/Box'
import Card from './Card'

storiesOf('Card', module)
  .add(
    'Basic Usage',
    (): React.ReactElement => (
      <Card
        margin="40px"
        useBoxShadow={boolean('useBoxShadow', true)}
        padding={text('padding', '')}
        paddingX={text('paddingX', '')}
        paddingY={text('paddingY', '')}
      >
        <h2 style={{ margin: 0 }}>{text('Title', 'Title')}</h2>
        <h4 style={{ margin: '0 0 8px', fontWeight: 400, fontSize: '12px' }}>
          {text('Subtitle', 'Subtitle')}
        </h4>

        <table style={{ fontSize: '15px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <Box
                as="th"
                style={{ textAlign: 'left', padding: '4px 60px 4px 0', fontSize: '12px' }}
              >
                Total Amount Due
              </Box>
              <td>
                <span style={{ textAlign: 'right', fontWeight: 600, fontSize: '25.92px' }}>
                  {text('Total Amount', '$350.20')}
                </span>
              </td>
            </tr>

            <tr>
              <th style={{ textAlign: 'left', fontWeight: 'normal', fontSize: '12px' }}>
                {' '}
                Due Date{' '}
              </th>
              <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '12px' }}>
                {new Date(date('Date', new Date('10/5/2020'))).toLocaleDateString()}
              </td>
            </tr>

            <tr>
              <th style={{ textAlign: 'left', fontWeight: 'normal', fontSize: '12px' }}>
                Minimum Amount Due
              </th>
              <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '12px' }}>
                {text('Minimum Amount', '$127.00')}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    )
  )
  .add(
    'Nested Cards',
    (): React.ReactElement => (
      <Card>
        Card 1
        <Card>
          Card 2<Card>Card 3</Card>
        </Card>
      </Card>
    )
  )
