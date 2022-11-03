import { Box } from '@repay/cactus-web'
import * as React from 'react'
import { ComponentDoc, PropItem } from 'react-docgen-typescript'
// TODO maybe move as outside component
import styled from 'styled-components'

import { useDocgen } from './DocgenProvider'

interface WithCols {
  children?: React.ReactNode
  columns?: string[]
}

const renderTableHeader = ({ columns, children }: WithCols) => {
  if (columns) {
    const tableBody = (
      <>
        <thead>
          <tr>
            {columns.map((col) => (
              <th>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </>
    )
    return { children: tableBody }
  }
}

export const BaseTable = styled.table.attrs(renderTableHeader)`
  border-radius: 8px;
  max-width: 100%;

  padding: 0;
  border-collapse: collapse;
  overflow: hidden;
  margin-bottom: 2em;

  thead {
    background-color: ${(p): string => p.theme.colors.darkContrast};
    border: none;
    padding: 0;
    font-size: 1.2em;
    text-align: left;
    color: ${(p): string => p.theme.colors.white};
  }

  th {
    font-weight: 400;
    padding: 1em;
    text-align: center;
    line-height: 1;
  }

  tbody {
    color: ${(p): string => p.theme.colors.text};

    & tr:nth-child(odd) {
      background-color: ${(p): string => p.theme.colors.white};
    }

    & tr:nth-child(even) {
      background-color: ${(p): string => p.theme.colors.lightContrast};
    }
  }

  td {
    padding: 1em;
    text-align: left;
  }

  @media only screen and (max-width: 750px) {
    min-width: 300px;

    thead {
      display: none;
    }

    table,
    td {
      display: block;
      border: none;
    }

    td {
      position: relative;
      padding: 0 10% 10% 35%;
      border-bottom: 1px solid #eee;
      overflow-x: auto;
    }

    td:before {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 30%;
      overflow-x: auto;
    }
    ${(p) =>
      p.columns?.reduce((headers: any, col, ix) => {
        headers[`td:nth-of-type(${ix + 1})::before`] = { content: `"${col}"` }
        return headers
      }, {})}
    td:last-of-type {
      border-bottom: 2px solid #131313;
    }
  }
`

const CactusTable = styled(BaseTable)`
  @media only screen and (max-width: 750px) {
    td:nth-of-type(1):before {
      content: ' Name';
    }
      td:nth-of-type(2):before {
      content: ' Required';
    }
    td:nth-of-type(3):before {
      content: 'Default Value';
    }
    td:nth-of-type(4):before {
      content: 'Type';
    }
    td:nth-of-type(5):before {
      content: 'Description';
    }

    td:nth-of-type(5) {
      border-bottom: 2px solid #131313;
    }
  }
`

const StylingTable = styled(BaseTable)`
  @media only screen and (max-width: 750px) {
    td:nth-of-type(1):before {
      content: ' Name';
    }
      td:nth-of-type(2):before {
      content: ' Required';
    }

    td:nth-of-type(3):before {
      content: 'Type';
    }
    td:nth-of-type(4):before {
      content: 'Description';
    }
    td:nth-of-type(4) {
      border-bottom: 2px solid #131313;
    }
  }
`

function sortProps(props: PropItem[]): PropItem[] {
  return props.sort((a, b): number => {
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    }
    return 0
  })
}

export type ComponentWithFileMeta = React.ComponentType & {
  __filemeta?: {
    filename: string
  }
}

interface PropsTableProps {
  of: ComponentWithFileMeta
  staticProp?: string
  fileName?: string
}

interface PropsMemo {
  props?: { [k: string]: any }
  coreProps?: { [k: string]: any }
  ownProps?: { [k: string]: any }
  styledSystemProps?: { [k: string]: any }
  styledComponentProps?: { [k: string]: any }
}

const PropsTable: React.FC<PropsTableProps> = ({
  of: component,
  staticProp,
  fileName,
}): React.ReactElement | null => {
  const data = useDocgen()
  // Not sure why some pull from `dist` instead of `src`.
  if (!fileName) {
    fileName = component.__filemeta?.filename.replace(/dist(.*)js/, 'src$1tsx')
  } else if (!fileName.includes('src')) {
    fileName = '../modules/cactus-web/src/' + fileName
  }
  const docItem = data.find((doc): boolean => doc.key === fileName)

  const { ownProps, styledSystemProps } = React.useMemo((): PropsMemo => {
    if (docItem === undefined) {
      return {}
    }
    const value = docItem.value
    let doc: ComponentDoc | undefined = value.find(
      (item): boolean => item.displayName === component.displayName
    )

    if (staticProp) {
      doc = value.find((item): boolean => item.displayName === staticProp)
    }

    const props = Object.values((doc && doc.props) || {})
    const ownProps = []
    const styledSystemProps = []
    const probablyStyledComponentProps = []
    for (let i = 0; i < props.length; ++i) {
      const prop = props[i]
      if (prop.parent) {
        const sourceFile = prop.parent.fileName
        if (sourceFile.includes('styled-system')) {
          styledSystemProps.push(prop)
        } else if (!sourceFile.includes('node_modules')) {
          prop.description = prop.description.replace(/!important\s*/, '')
          ownProps.push(prop)
        }
      } else {
        probablyStyledComponentProps.push(prop)
      }
    }
    sortProps(ownProps)
    sortProps(styledSystemProps)
    const coreProps = sortProps(ownProps.concat(styledSystemProps))
    return {
      props,
      coreProps,
      ownProps,
      styledSystemProps,
      styledComponentProps: probablyStyledComponentProps,
    }
  }, [component.displayName, docItem, staticProp])

  if (ownProps === undefined) {
    return null
  }

  return (
    <React.Fragment>
      <Box>
        <h3>Cactus Props</h3>
        {Array.isArray(ownProps) && ownProps.length !== 0 ? (
          <CactusTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Required</th>
                <th>Default Value</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {ownProps.map(
                (prop): React.ReactElement => (
                  <tr key={prop.name}>
                    <td>
                      <code>{prop.name}</code>
                    </td>
                    <td>{prop.required ? 'Y' : 'N'}</td>
                    <td>
                      {prop.defaultValue &&
                        (prop.defaultValue.value === ''
                          ? '{empty string}'
                          : prop.defaultValue.value)}
                    </td>
                    <td>{prop.type.name}</td>
                    <td>{prop.description}</td>
                  </tr>
                )
              )}
            </tbody>
          </CactusTable>
        ) : (
          <Box>There are no custom props.</Box>
        )}
        {Array.isArray(styledSystemProps) && styledSystemProps.length !== 0 && (
          <>
            <h3>Styling Props</h3>
            <StylingTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Required</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {styledSystemProps.map(
                  (prop): React.ReactElement => (
                    <tr key={prop.name}>
                      <td>
                        <code>{prop.name}</code>
                      </td>
                      <td>{prop.required ? 'Y' : 'N'}</td>
                      <td>{prop.type.name}</td>
                      <td>{prop.description}</td>
                    </tr>
                  )
                )}
              </tbody>
            </StylingTable>
          </>
        )}
      </Box>
    </React.Fragment>
  )
}

export default PropsTable
