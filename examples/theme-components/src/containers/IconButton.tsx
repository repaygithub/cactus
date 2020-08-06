import { RouteComponentProps } from '@reach/router'
import * as icons from '@repay/cactus-icons/i'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import cactusTheme from '@repay/cactus-theme'
import { Flex, Grid, IconButton, SelectField, Text, ToggleField } from '@repay/cactus-web'
import { IconButtonSizes, IconButtonVariants } from '@repay/cactus-web/src/IconButton/IconButton'
import React, { useCallback, useState } from 'react'

import Link from '../components/Link'

const iconButtonVariants: IconButtonVariants[] = ['standard', 'action', 'danger']
const iconButtonSizes: IconButtonSizes[] = ['tiny', 'small', 'medium', 'large']

interface PropTypes {
  variant: IconButtonVariants
  iconSize: IconButtonSizes
  disabled: boolean
  inverse: boolean
}
const initState: PropTypes = {
  variant: 'standard',
  iconSize: 'medium',
  disabled: false,
  inverse: false,
}
const IconbuttonExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [state, setState] = useState<PropTypes>(initState)

  const containerStyle = {
    backgroundColor: cactusTheme.colors.base,
    color: cactusTheme.colors.white,
    minHeight: '100vh',
  }

  const changeVariant = useCallback(
    (name, value): void => {
      setState({ ...state, [name]: value })
    },
    [state]
  )
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center" mb={0}>
        IconButton
      </Text>
      <Flex margin="auto" justifyContent="space-around" alignItems="flex-end" mb={32}>
        <SelectField
          marginTop="16px"
          label="Select Variant"
          options={iconButtonVariants}
          name="variant"
          value={state.variant}
          onChange={changeVariant}
        />
        <SelectField
          label="Select Variant"
          options={iconButtonSizes}
          name="iconSize"
          value={state.iconSize}
          onChange={changeVariant}
        />
        <ToggleField
          name="disabled"
          label="Disabled"
          onChange={changeVariant}
          value={state.disabled}
        />
        <ToggleField
          name="inverse"
          label="Inverse"
          onChange={changeVariant}
          value={state.inverse}
        />
      </Flex>
      <Grid justify="center" style={state.inverse ? containerStyle : {}}>
        {Object.values(icons)
          .slice(0, Object.keys(icons).length - 2)
          .map(
            (Icon: React.ComponentType<any>, ix): React.ReactElement => (
              <Grid.Item tiny={3} medium={2} large={1} key={ix}>
                <IconButton
                  label={`icb-${ix}`}
                  variant={state.variant}
                  iconSize={state.iconSize}
                  disabled={state.disabled}
                  inverse={state.inverse}
                >
                  <Icon />
                </IconButton>
              </Grid.Item>
            )
          )}
      </Grid>
    </div>
  )
}
export default IconbuttonExample
