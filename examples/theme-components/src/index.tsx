import React, { Component, Suspense } from 'react'
import ReactDOM from 'react-dom'

import * as styledComponents from 'styled-components'
import { Flex, Spinner, StyleProvider } from '@repay/cactus-web'
import { Router } from '@reach/router'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'

const ButtonsPage = React.lazy(() =>
  import(/* webpackChunkName: "Buttons" */ './containers/Buttons')
)
const HomePage = React.lazy(() => import(/* webpackChunkName: "Home" */ './containers/Home'))
const InverseButtonsPage = React.lazy(() =>
  import(/* webpackChunkName: "InverseButtons" */ './containers/InverseButtons')
)
const FormExample = React.lazy(() =>
  import(/* webpackChunkName: "FormExample" */ './containers/FormExample')
)

const AccessibleFieldExample = React.lazy(() =>
  import(/* webpackChunkName: "AccessibleField" */ './containers/AccessibleField')
)
const ModalExample = React.lazy(() => import(/* webpackChunkName: "Modal" */ './containers/Modal'))

const BreadcrumbExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/Breadcrumb')
)
const AccordionExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/Accordion')
)

const AvatarExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/Avatar')
)
const AlertExample = React.lazy(() => import(/* webpackChunkName: "Modal" */ './containers/Alert'))

const DateInputExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/DateInput')
)

const DateInputFieldExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/DateInputField')
)
const FieldWrapperExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/FieldWrapper')
)

const FileInputExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/FileInput')
)

const FileInputFieldExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/FileInputField')
)
const FlexExample = React.lazy(() => import(/* webpackChunkName: "Modal" */ './containers/Flex'))

const GridExample = React.lazy(() => import(/* webpackChunkName: "Modal" */ './containers/Grid'))

const IconButtonExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/IconButton')
)

const MenuButtonExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/MenuButton')
)

const StepAvatarExample = React.lazy(() =>
  import(/* webpackChunkName: "Modal" */ './containers/StepAvatar')
)

const Icons = React.lazy(() => import(/* webpackChunkName: "Icons" */ './containers/Icons'))

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

const GlobalStyle = createGlobalStyle`
  html,
  body {
    min-height: 100vh;
    overflow: auto;
  }
`

class RootTheme extends Component {
  render() {
    return (
      <StyleProvider theme={cactusTheme} global>
        <Suspense
          fallback={
            <Flex width="100%" justifyContent="center" p={4}>
              <Spinner />
            </Flex>
          }
        >
          <GlobalStyle />
          <Router style={{ height: '90vh' }}>
            <HomePage path="/" />
            <AccessibleFieldExample path="/AccessibleField" />
            <ButtonsPage path="/Buttons/Standard" />
            <InverseButtonsPage path="/Buttons/Inverse" />
            <FormExample path="/FormElements" />
            <Icons path="/Icons" />
            <AccessibleFieldExample path="/AccessibleField" />
            <ModalExample path="/Modal" />
            <BreadcrumbExample path="/Breadcrumb" />
            <AccordionExample path="/Accordion" />
            <AlertExample path="/Alert" />
            <AvatarExample path="/Avatar" />
            <DateInputExample path="/DateInput" />
            <DateInputFieldExample path="/DateInputField" />
            <FieldWrapperExample path="/FieldWrapper" />
            <FileInputExample path="/FileInput" />
            <FileInputFieldExample path="/FileInputField" />
            <FlexExample path="/Flex" />
            <GridExample path="/Grid" />
            <IconButtonExample path="/IconButton" />
            <MenuButtonExample path="/MenuButton" />
            <StepAvatarExample path="/StepAvatar" />
          </Router>
        </Suspense>
      </StyleProvider>
    )
  }
}

ReactDOM.render(<RootTheme />, appRoot)
