import * as React from 'react'

import { Box } from '@repay/cactus-web'
import { ComponentDoc, PropItem } from 'react-docgen-typescript'
import { useDocgen } from './DocgenProvider'

// TODO maybe move as outside component
import styled from 'styled-components'

const Table = styled.table`
  border-radius: 8px;
  max-width: 100%;

  padding: 0;
  border-collapse: collapse;
  overflow: hidden;
  margin-bottom: 2em;

  thead {
    background-color: ${p => p.theme.colors.darkContrast};
    border: none;
    padding: 0;
    font-size: 1.2em;
    text-align: left;
    color: ${p => p.theme.colors.baseText};
  }

  th {
    font-weight: 400;
    padding: 1em;
    text-align: center;
    line-height: 1;
  }

  tbody {
    color: ${p => p.theme.colors.text};

    & tr:nth-child(odd) {
      background-color: ${p => p.theme.colors.white};
    }

    & tr:nth-child(even) {
      background-color: ${p => p.theme.colors.lightContrast};
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
  }
`

const CactusTable = styled(Table)`
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

const StylingTable = styled(Table)`
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

function sortProps(props: PropItem[]) {
  return props.sort((a, b) => {
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

type PropsTableProps = {
  of: ComponentWithFileMeta
  staticProp?: string
}

const PropsTable: React.FC<PropsTableProps> = ({ of: component, staticProp }) => {
  const data = useDocgen()
  const fileName = component.__filemeta && component.__filemeta.filename
  const docItem = data.find(doc => doc.key === fileName)

  const { ownProps, styledSystemProps } = React.useMemo(() => {
    if (docItem === undefined) {
      return {}
    }
    let value = docItem.value
    let doc: ComponentDoc | undefined = value[0]
    if (staticProp) {
      doc = value.find(item => item.displayName === staticProp)
    }
    const componentName = doc && doc.displayName
    const props = Object.values((doc && doc.props) || {})
    const ownProps = []
    const styledSystemProps = []
    const probablyStyledComponentProps = []
    for (let i = 0; i < props.length; ++i) {
      const prop = props[i]
      if (prop.parent) {
        let sourceFile = prop.parent.fileName
        if (
          sourceFile.endsWith(componentName + '.tsx') ||
          sourceFile.endsWith(component.displayName + '.tsx') ||
          prop.description.includes('!important')
        ) {
          prop.description = prop.description.replace(/!important\s*/, '')
          ownProps.push(prop)
        } else if (sourceFile.includes('styled-system')) {
          styledSystemProps.push(prop)
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
  }, [component, docItem, staticProp])

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
              {ownProps.map(prop => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                  </td>
                  <td>{prop.required ? 'Y' : 'N'}</td>
                  <td>
                    {prop.defaultValue &&
                      (prop.defaultValue.value === '' ? '{empty string}' : prop.defaultValue.value)}
                  </td>
                  <td>{prop.type.name}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
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
                {styledSystemProps.map(prop => (
                  <tr key={prop.name}>
                    <td>
                      <code>{prop.name}</code>
                    </td>
                    <td>{prop.required ? 'Y' : 'N'}</td>
                    <td>{prop.type.name}</td>
                    <td>{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </StylingTable>
          </>
        )}
      </Box>
    </React.Fragment>
  )
}

export default PropsTable
