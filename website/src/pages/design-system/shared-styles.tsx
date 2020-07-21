import * as React from 'react'

import { Box, Flex } from '@repay/cactus-web'
import ColumnImage from '../design-system/grid-columns.png'
import GridImage from '../design-system/grid-numbered.png'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Text, { Span } from '../../components/Text'

interface ShadowBoxProps extends React.ComponentPropsWithRef<typeof Flex> {
  shadow: string
}

const ShadowBox = styled<React.FC<ShadowBoxProps>>(Flex)`
  box-shadow: ${(p) => `${p.shadow} ${p.theme.colors.callToAction}`};
`

ShadowBox.defaultProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 5,
  width: '150px',
  height: '150px',
}

const Table = styled('table')`
  border-collapse: collapse;

  th {
    border: 1px solid black;
    text-align: left;
    padding: 3px;
  }
  td {
    border: 1px solid black;
    font-weight: 200;
    padding: 3px;
  }

  @media only screen and (max-width: 500px) {
    table, thead, tbody, th, td {
      display: block;
      align: left;
    }

    thead tr {
    display: none;
    }
    td  {
      border: none;
      position: relative;
      border-bottom: 1px solid #eee;
      padding: 2px 0 10px 225px;
    }
    
    td:before {
    position: absolute;
    text-align: left;
    top: 2px;
    left: 2px;
    }

    td:nth-of-type(1):before { content: "Breaking Points"; }
    td:nth-of-type(2):before { content: "Responsive Sizes"; }
    td:nth-of-type(3):before { content: "Content Size"; }
    td:nth-of-type(4):before { content: "Column Size";  }
    td:nth-of-type(5):before { content: "Columns";  }
    td:nth-of-type(6):before { content: "Margin";  }
    td:nth-of-type(7):before { content: "Gutter";  }
    td:nth-of-type(7) {border-bottom: 2px solid #131313;}
  }
`

const ColumnKey = styled('table')`
  padding: 5% 0 0 2%;

  th {
    padding: 20px 0 0 0;
    font-weight: 600;
    text-align: left;
  }
  td {
    padding: 5px 0 0 0;
    font-weight: 200;
    text-align: left;
  }
  @media only screen and (max-width: 1000px) {
    width: 100%;
  }
`

const TableSpacing = styled('table')`
  border-collapse: collapse;
  font-weight: 200;
  td {
    text-align: right;
  }
`

interface SpacingBoxProps {
  color: string
  padding: string
}

const SpacingBox = (props: SpacingBoxProps) => {
  return (
    <Flex
      margin="0"
      width="50px"
      height="50px"
      bg="white"
      justifyContent="center"
      alignItems="center"
      borderColor={props.color}
      borderStyle="solid"
      borderWidth={props.padding}
      style={{ boxSizing: 'content-box' }}
    >
      <span>{props.padding}</span>
    </Flex>
  )
}

const Img = styled('img')`
  width: auto;
  max-width: 75%;
  heght: auto;
`

const Clear = styled(Box)`
  ::after {
    content: '';
    display: block;
    clear: both;
  }
`

export default () => {
  return (
    <>
      <Helmet title="Shared Styles" />

      <Text as="h1" fontSize="h1">
        Shared Styles
      </Text>

      <Text as="h2" fontSize="h2">
        Shadow
      </Text>

      <Flex>
        <ShadowBox shadow="0 0 3px">
          <Box as="h2">S0</Box>
        </ShadowBox>

        <ShadowBox shadow="0 3px 8px">
          <Box as="h2">S1</Box>
        </ShadowBox>

        <ShadowBox shadow="0 9px 24px">
          <Box as="h2">S2</Box>
        </ShadowBox>

        <ShadowBox shadow="0 12px 24px">
          <Box as="h2">S3</Box>
        </ShadowBox>

        <ShadowBox shadow="0 30px 42px">
          <Box as="h2">S4</Box>
        </ShadowBox>

        <ShadowBox shadow="0 45px 48px">
          <Box as="h2">S5</Box>
        </ShadowBox>
      </Flex>

      <Text as="h2" fontSize="h2">
        Base Grid
      </Text>
      <Text>
        The base grid is the reference from which the rest of the layout structures are built. It
        defines the starting point of the dimensions, as well as the paddings and margins of the
        elements of the interface.
      </Text>
      <Text>
        The grid is built from a base 8 pixel module so that both the sizes of the elements and the
        spaces between them will always be multiples of 8: 16, 24, 32, 40, 48.
      </Text>
      <Text>
        There may be situations, however where a value smaller than 8px is required; the 4px unit is
        available for these cases.
      </Text>
      <Text>
        This grid enables the creation of a standard interface by defining the abstract composition
        of an page and how individual components associate within an interface.
      </Text>
      <Text> The main bar, footer, and action bar use the 8pt grid for placement.</Text>
      <Clear>
        <Img src={GridImage} alt="Columns" style={{ padding: '1% 0 0 0 ' }} />

        <Text style={{ float: 'left', padding: '5% 5% 0 5%' }}>
          Our product is composed of <br /> 1) Main Bar (Quickline Bar) <br />
          2) Action Bar
          <br /> 3) Side panel <br /> 4) Content <br /> 5) Footer
        </Text>
      </Clear>
      <br />
      <Clear>
        <Img src={ColumnImage} alt="Grid" style={{ float: 'left', padding: '4% 3% 0 2% ' }} />

        <ColumnKey>
          <thead>
            <tr>
              <th>
                <Flex width="20px" height="20px" style={{ backgroundColor: 'hsl(200, 50%, 89%)' }}>
                  <Box m="0 0 0 30px"> Column</Box>
                </Flex>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: '275px' }}>
                The columns are fluid, having a responsive width which conforms to the size of their
                parent container.
              </td>
            </tr>

            <th>
              <Flex width="20px" height="20px" style={{ backgroundColor: 'hsl(200, 52%, 54%)' }}>
                <Box m="0 0 0 30px"> Margin</Box>
              </Flex>
            </th>

            <tr>
              <td style={{ width: '150px' }}>
                Margins are the negative space between the edge of the format and the outer edge of
                the content.
              </td>
            </tr>

            <th>
              <Flex width="20px" height="20px" style={{ backgroundColor: 'hsl(200, 51%, 77%)' }}>
                <Box m="0 0 0 30px"> Gutter</Box>
              </Flex>
            </th>

            <tr>
              <td style={{ width: '150px' }}>
                Grid columns are seperated by areas of white space referred to as "gutters". Gutters
                improve legibility by providing negative space between page elements.
              </td>
            </tr>
          </tbody>
        </ColumnKey>
      </Clear>

      <Text as="h2" fontSize="h2" textAlign="left" style={{ padding: '5% 0 0 0' }}>
        Break-points
      </Text>
      <Text>
        The different column sizes automatically change dimensions if they reach a breakpoint.
      </Text>

      <Table>
        <thead>
          <tr>
            <th>Breaking Points</th>
            <th>Responsive Sizes</th>
            <th>Content Size</th>
            <th>Column Size</th>
            <th>Columns</th>
            <th>Margin</th>
            <th>Gutter</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>small</td>
            <td> &gt;768px</td>
            <td> 708</td>
            <td> 102</td>
            <td> 6</td>
            <td> 8</td>
            <td> 16</td>
          </tr>

          <tr>
            <td>medium</td>
            <td> &gt;1024px</td>
            <td> 964</td>
            <td> 104</td>
            <td> 8</td>
            <td> 10</td>
            <td> 16</td>
          </tr>

          <tr>
            <td>large</td>
            <td> &gt;1200px</td>
            <td> 1140</td>
            <td> 79</td>
            <td> 12</td>
            <td> 8</td>
            <td> 16</td>
          </tr>

          <tr>
            <td>extra large</td>
            <td> &gt;1440px</td>
            <td> 1380</td>
            <td> 99</td>
            <td> 12</td>
            <td> 6</td>
            <td> 16</td>
          </tr>
        </tbody>
      </Table>
      <Text as="h2" fontSize="h2">
        Spacing
      </Text>
      <Text>
        The 8px base grid is also used as a baseline to determine the spacing between elements.
      </Text>

      <TableSpacing>
        <tbody>
          <tr>
            <td> Extra Small </td>

            <td style={{ padding: '0 0 0 100px' }}>
              <SpacingBox padding="4px" color="hsl(200, 48%, 94%)" />
            </td>
          </tr>

          <tr>
            <td> Mini </td>

            <td style={{ padding: '20px 0 0 100px' }}>
              <SpacingBox padding="8px" color="hsl(200, 48%, 94%)" />
            </td>
          </tr>

          <tr>
            <td> Small </td>
            <td style={{ padding: '20px 0 0 100px' }}>
              <SpacingBox padding="16px" color="hsl(200, 47%, 88%)" />
            </td>
          </tr>

          <tr>
            <td> Medium </td>
            <td style={{ padding: '20px 0 0 100px' }}>
              <SpacingBox padding="24px" color="hsl(200, 48%, 76%)" />
            </td>
          </tr>

          <tr>
            <td> Large </td>
            <td style={{ padding: '20px 0 0 100px' }}>
              <SpacingBox padding="32px" color="hsl(200, 50%, 70%)" />
            </td>
          </tr>

          <tr>
            <td> Extra Large </td>
            <td style={{ padding: '20px 0 0 100px ' }}>
              <SpacingBox padding="40px" color="hsl(200, 50%, 70%)" />
            </td>
          </tr>
        </tbody>
      </TableSpacing>
    </>
  )
}
