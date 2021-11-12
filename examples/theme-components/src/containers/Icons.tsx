import { RouteComponentProps } from '@reach/router'
import icons, { IconSizes } from '@repay/cactus-icons'
import { CactusColor, CactusTheme } from '@repay/cactus-theme'
import { Box, Flex, Grid, SelectField, Text } from '@repay/cactus-web'
import * as React from 'react'
import { withTheme } from 'styled-components'

const iconSizes: IconSizes[] = ['tiny', 'small', 'medium', 'large']

const IconsPage: React.FC<RouteComponentProps & { theme: CactusTheme }> = ({
  theme,
}): React.ReactElement => {
  const themeColors = Object.keys(theme.colors) as CactusColor[]
  const [color, setColor] = React.useState(themeColors[0])
  const [size, setSize] = React.useState<IconSizes>('medium')

  return (
    <Box p={4}>
      <Text as="h1">Icons</Text>
      <Flex my={4}>
        <SelectField
          name="icon_color"
          label="Icon Color"
          value={color}
          options={themeColors}
          onChange={({ target: { value } }): void => setColor(value as CactusColor)}
        />
        <SelectField
          name="icon_size"
          label="Icon Size"
          value={size}
          options={iconSizes}
          onChange={({ target: { value } }): void => setSize(value as IconSizes)}
          ml={4}
          mt={0}
        />
      </Flex>
      <Box color={color}>
        <Grid justify="center">
          {Object.entries(icons).map(
            ([name, Icon]): React.ReactElement => (
              <Grid.Item key={name} tiny={1}>
                <Icon iconSize={size} />
              </Grid.Item>
            )
          )}
        </Grid>
      </Box>
    </Box>
  )
}

export default withTheme(IconsPage)
