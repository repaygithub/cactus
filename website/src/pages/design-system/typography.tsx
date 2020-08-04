import cactusTheme from '@repay/cactus-theme'
import { Flex } from '@repay/cactus-web'
import * as React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import ArialExample from '../../assets/font-arial.png'
import HelveticaExample from '../../assets/font-helvetica.png'
import Link from '../../components/Link'
import Text, { Span } from '../../components/Text'

const Table = styled('table')`
  th,
  td {
    padding: 16px;
  }

  @media only screen and (max-width: 500px){
    table, thead, tbody, th, td {
      display: block;
      align: left;
    }

    thead  {
    display: none;
    }
    
    td {
      border: none;
      position: relative;
      padding: 0 10% 10% 35%;
      border-bottom: 1px solid #eee;
      overflow-x:auto;
    }
    
    td:before {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 30%;
    }

    td:nth-of-type(1):before { content: " Scale"; }
    td:nth-of-type(2):before { content: " Rem"; }
    td:nth-of-type(3):before { content: "PX"; }
    td:nth-of-type(4):before { content: "Line Height";  }

    td:nth-of-type(5) { border-bottom: 2px solid #131313; }

  }
`
const WeightFlex = styled(Flex)`
  justify-content: space-evenly;

  @media only screen and (max-width: 500px) {
    justify-content: center;
  }
`

export default (): React.ReactElement => {
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
          style={{ width: '50%', minWidth: '300px', maxWidth: '600px' }}
        />
        <img
          src={ArialExample}
          alt="Arial font example"
          style={{
            width: '50%',
            maxWidth: '600px',
            minWidth: '300px',
            paddingTop: '20px',
          }}
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
              <Span fontSize={cactusTheme.fontSizes.h1}>H1</Span>
            </td>
            <td>{(cactusTheme.fontSizes.h1 / 18).toFixed(3)} em</td>
            <td>{cactusTheme.fontSizes.h1} px</td>
            <td>{cactusTheme.textStyles.h1.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h1}>The quick brown fox...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h2}>H2</Span>
            </td>
            <td>{(cactusTheme.fontSizes.h2 / 18).toFixed(3)} em</td>
            <td>{cactusTheme.fontSizes.h2} px</td>
            <td>{cactusTheme.textStyles.h2.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h2}>The quick brown fox jumps...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h3}>H3</Span>
            </td>
            <td>{(cactusTheme.fontSizes.h3 / 18).toFixed(2)} em</td>
            <td>{cactusTheme.fontSizes.h3} px</td>
            <td>{cactusTheme.textStyles.h3.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h3}>The quick brown fox jumps over...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h4}>H4</Span>
            </td>
            <td>{(cactusTheme.fontSizes.h4 / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes.h4} px</td>
            <td>{cactusTheme.textStyles.h4.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.h4}>The quick brown fox jumps over the...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.fontSizes.p}>P</Span>
            </td>
            <td>{(cactusTheme.fontSizes.p / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes.p} px</td>
            <td>{cactusTheme.textStyles.body.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.p}>
                The quick brown fox jumps over the lazy dog.
              </Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.fontSizes.small}>small</Span>
            </td>
            <td>{(cactusTheme.fontSizes.small / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes.small} px</td>
            <td>{cactusTheme.textStyles.small.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.small}>
                The quick brown fox jumps over the lazy dog.
              </Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.fontSizes.tiny}>tiny</Span>
            </td>
            <td>{(cactusTheme.fontSizes.tiny / 18).toFixed(1)} em</td>
            <td>{cactusTheme.fontSizes.tiny} px</td>
            <td>{cactusTheme.textStyles.tiny.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.fontSizes.tiny}>
                The quick brown fox jumps over the lazy dog.
              </Span>
            </td>
          </tr>
        </tbody>
      </Table>
      <h2>Mobile Scale</h2>
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
              <Span fontSize={cactusTheme.mobileFontSizes.h1}>H1</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.h1 / 18).toFixed(3)} em</td>
            <td>{cactusTheme.mobileFontSizes.h1} px</td>
            <td>{cactusTheme.mobileTextStyles.h1.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h1}>The quick brown fox...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h2}>H2</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.h2 / 18).toFixed(3)} em</td>
            <td>{cactusTheme.mobileFontSizes.h2} px</td>
            <td>{cactusTheme.mobileTextStyles.h2.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h2}>The quick brown fox jumps...</Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h3}>H3</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.h3 / 18).toFixed(2)} em</td>
            <td>{cactusTheme.mobileFontSizes.h3} px</td>
            <td>{cactusTheme.mobileTextStyles.h3.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h3}>
                The quick brown fox jumps over...
              </Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h4}>H4</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.h4 / 18).toFixed(1)} em</td>
            <td>{cactusTheme.mobileFontSizes.h4} px</td>
            <td>{cactusTheme.mobileTextStyles.h4.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.h4}>
                The quick brown fox jumps over the...
              </Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.p}>P</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.p / 18).toFixed(1)} em</td>
            <td>{cactusTheme.mobileFontSizes.p} px</td>
            <td>{cactusTheme.mobileTextStyles.body.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.p}>
                The quick brown fox jumps over the lazy dog.
              </Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.small}>small</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.small / 18).toFixed(1)} em</td>
            <td>{cactusTheme.mobileFontSizes.small} px</td>
            <td>{cactusTheme.mobileTextStyles.small.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.small}>
                The quick brown fox jumps over the lazy dog.
              </Span>
            </td>
          </tr>
          <tr>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.tiny}>tiny</Span>
            </td>
            <td>{(cactusTheme.mobileFontSizes.tiny / 18).toFixed(1)} em</td>
            <td>{cactusTheme.mobileFontSizes.tiny} px</td>
            <td>{cactusTheme.mobileTextStyles.tiny.lineHeight}</td>
            <td>
              <Span fontSize={cactusTheme.mobileFontSizes.tiny}>
                The quick brown fox jumps over the lazy dog.
              </Span>
            </td>
          </tr>
        </tbody>
      </Table>
      <h2>Weight</h2>
      <Text>We use different weights to convey a visual rhythm and hierarchy.</Text>
      <WeightFlex>
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
      </WeightFlex>
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
        Next, we'll review all the <Link href="/design-system/icons/">icons</Link>.
      </Text>
    </>
  )
}
