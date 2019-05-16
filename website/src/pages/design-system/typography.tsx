import * as React from 'react'

import Box, { Flex } from '../../components/Box'
import cactusTheme from '@repay/cactus-theme'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Text, { Span } from '../../components/Text'

import ArialExample from '../../assets/font-arial.png'
import HelveticaExample from '../../assets/font-helvetica.png'

const Table = styled('table')`
  th,
  td {
    padding: 16px;
  }
`

export default () => {
  return (
    <>
      <Helmet title="Typography" />
      <h1>Typography</h1>
      <Text>
        Cactus uses Helvetica as the principal font. It is classic, clean, and practical. Unix and
        Apple computers have always had Helvetica, and it is a native font on PostScript printers.
        In the case were Helvetica is missing, the fallback is Arial. Arial is a near-copy of
        Helvetica, updated slightly, and installed on Windows in place of Helvetica.
      </Text>
      <Flex alignItems="center">
        <img
          src={HelveticaExample}
          alt="Helvetica font example"
          style={{ width: '50%', maxWidth: '600px' }}
        />
        <img
          src={ArialExample}
          alt="Arial font example"
          style={{ width: '50%', maxWidth: '600px', paddingTop: '16px' }}
        />
      </Flex>
      <h2>Scale</h2>
      <Table>
        <thead>
          <tr>
            <th>
              <Span>SCALE</Span>
            </th>
            <th>
              <Span>REM</Span>
            </th>
            <th>
              <Span>PX</Span>
            </th>
            <th>
              <Span>LINE HEIGHT</Span>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Span fontSize="h1">H1</Span>
            </td>
            <td>{(cactusTheme.fontSizes[5] / 18).toFixed(3)} em</td>
            <td>{cactusTheme.fontSizes[5]} px</td>
            <td>{Math.round(cactusTheme.fontSizes[5] * 1.5)} px</td>
            <td>
              <Span fontSize="h1">The quick brown fox...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize="h2">H2</Span>
            </td>
            <td>{(cactusTheme.fontSizes[4] / 18).toFixed(3)} em</td>
            <td>{cactusTheme.fontSizes[4]} px</td>
            <td>{Math.round(cactusTheme.fontSizes[4] * 1.54)} px</td>
            <td>
              <Span fontSize="h2">The quick brown fox jumps...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize="h3">H3</Span>
            </td>
            <td>{(cactusTheme.fontSizes[3] / 18).toFixed(2)} em</td>
            <td>{cactusTheme.fontSizes[3]} px</td>
            <td>{Math.round(cactusTheme.fontSizes[3] * 1.54)} px</td>
            <td>
              <Span fontSize="h3">The quick brown fox jumps over...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize="h4">H4</Span>
            </td>
            <td>{(cactusTheme.fontSizes[2] / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes[2]} px</td>
            <td>{Math.round(cactusTheme.fontSizes[2] * 1.5)} px</td>
            <td>
              <Span fontSize="h4">The quick brown fox jumps over the...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize="p">P</Span>
            </td>
            <td>{(cactusTheme.fontSizes[1] / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes[1]} px</td>
            <td>{Math.round(cactusTheme.fontSizes[1] * 1.54)} px</td>
            <td>
              <Span fontSize="p">The quick brown fox jumps over the lazy dog.</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize="small">small</Span>
            </td>
            <td>{(cactusTheme.fontSizes[0] / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes[0]} px</td>
            <td>{Math.round(cactusTheme.fontSizes[0] * 1.54)} px</td>
            <td>
              <Span fontSize="small">The quick brown fox jumps over the lazy dog.</Span>
            </td>
          </tr>
        </tbody>
      </Table>
      <h2>Weight</h2>
      <Text>We use different weights to convey a visual rhythm and hierarchy.</Text>
      <Flex justifyContent="space-between">
        <Flex flexDirection="column" alignItems="center" p={4}>
          <Span fontSize="h1" fontWeight={300}>
            w300
          </Span>
          <Span fontSize="h1" fontWeight={300}>
            Light Weight
          </Span>
        </Flex>
        <Flex flexDirection="column" alignItems="center" p={4}>
          <Span fontSize="h1" fontWeight={400}>
            w400
          </Span>
          <Span fontSize="h1" fontWeight={400}>
            Regular Weight
          </Span>
        </Flex>
        <Flex flexDirection="column" alignItems="center" p={4}>
          <Span fontSize="h1" fontWeight={600}>
            w600
          </Span>
          <Span fontSize="h1" fontWeight={600}>
            Bold Weight
          </Span>
        </Flex>
      </Flex>
      <Text fontStyle="italic">
        The Light Weight should only be used at sizes greater than or equal to 18px / 1 rem.
        Additionally, Arial doesn't have a 300 weight by default and therefore will not be
        differentiated on Windows operating systems.
      </Text>
      <Text as="h2" my="5">
        Hierarchy
      </Text>
      <Text>
        Content hierarchy informs the user how to classify what they see. This clarity improves how
        quickly the user can navigate the interface.
      </Text>
      <Text>
        Line lengths are ideally limited to 50-60 characters on desktop and 30-40 characters on
        mobile. Additionally, light text weights are avoided especially at small font sizes.
      </Text>
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'right', paddingRight: '16px' }}>
              <Span fontSize="h1" fontWeight={600}>
                H1
              </Span>
            </th>
            <td>
              <Text as="h1">Heading</Text>
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: 'right', paddingRight: '16px' }}>
              <Span fontSize="h4" fontWeight={400}>
                H4
              </Span>
            </th>
            <td>
              <Text as="h4" fontSize="h4" m={0} fontWeight={400}>
                SubHeading
              </Text>
            </td>
          </tr>
          <tr>
            <th
              style={{
                verticalAlign: 'text-top',
                paddingTop: '16px',
                paddingRight: '16px',
                textAlign: 'right',
              }}
            >
              <Span fontWeight={400}>P</Span>
            </th>
            <td>
              <Text>
                Stilton who moved my cheese blue castello. Lancashire cow mascarpone say cheese
                parmesan cauliflower cheese melted cheese cheesy feet. Mozzarella pecorino hard
                cheese rubber cheese squirty cheese the big cheese feta melted cheese. Stilton
                danish fontina jarlsberg cheesy feet queso boursin edam monterey jack. Cheese
                strings fromage frais stinking bishop cheese slices cheese and biscuits bavarian
                bergkase parmesan melted cheese. Halloumi croque monsieur hard cheese say cheese
                port-salut cheeseburger pepper jack cheese on toast. Mascarpone feta swiss
                cauliflower cheese manchego.
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
      <Text mt={6} mb={5} fontSize="h3">
        Next, we'll review all the <a href="/design-system/icons/">icons</a>.
      </Text>
    </>
  )
}
