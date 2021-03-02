import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Box from '../Box/Box'
import Card from '../Card/Card'
import Flex from '../Flex/Flex'
import Divider from './Divider'

export default {
  title: 'Divider',
  component: Divider,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  return (
    <Card useBoxShadow padding="10px">
      <Flex padding="10px" flexDirection="column">
        <h3 style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}>Payment Schedule</h3>
        <h4 style={{ margin: '0', fontWeight: 400, fontSize: '12px', textAlign: 'center' }}>
          Weekly on mondays (42 payments)
        </h4>
      </Flex>
      <Divider />

      <table style={{ fontSize: '15px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <Box as="th" style={{ textAlign: 'left', padding: '4px 60px 4px 0', fontSize: '12px' }}>
              Schedule begins on:
            </Box>
            <td>
              <span style={{ textAlign: 'right', fontWeight: 200, fontSize: '11px' }}>
                05/11/20
              </span>
            </td>
          </tr>
          <tr>
            <Box as="th" style={{ textAlign: 'left', padding: '4px 60px 4px 0', fontSize: '12px' }}>
              Schedule ends on:
            </Box>
            <td>
              <span style={{ textAlign: 'right', fontWeight: 200, fontSize: '11px' }}>
                11/11/2021
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <Divider />
      <table style={{ fontSize: '15px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <Box as="th" style={{ textAlign: 'left', padding: '4px 60px 4px 0', fontSize: '12px' }}>
              Total Amount Due:
            </Box>
            <td>
              <span style={{ textAlign: 'right', fontWeight: 600, fontSize: '12px' }}>$500</span>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
