import * as React from 'react'

import { Box } from '@repay/cactus-web'
import { ComponentDoc, PropItem } from 'react-docgen-typescript'
import { useDocgen } from './DocgenProvider'

// TODO maybe move as outside component
import styled from 'styled-components'

const Table = styled.table`
  border-radius: 8px;
  width: 100%;
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
        } else if (sourceFile.includes('styled-system') || sourceFile.includes('helpers/margins')) {
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
          <Table>
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
          </Table>
        ) : (
          <Box>There are no custom props.</Box>
        )}
        {Array.isArray(styledSystemProps) && styledSystemProps.length !== 0 && (
          <>
            <h3>Styling Props</h3>
            <Table>
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
            </Table>
          </>
        )}
      </Box>
    </React.Fragment>
  )
}

export default PropsTable
