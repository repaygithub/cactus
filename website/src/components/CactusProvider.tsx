import { ActionsGear } from '@repay/cactus-icons'
import cactusTheme, { CactusTheme, generateTheme, GeneratorOptions } from '@repay/cactus-theme'
import {
  AccessibleField,
  Box,
  Button,
  Flex,
  IconButton,
  RadioButtonField,
  StyleProvider,
  TextInputField,
} from '@repay/cactus-web'
import React, {
  FormEvent,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface ThemeArgsContextType {
  update: (opt: GeneratorOptions) => void
  theme: CactusTheme
}
const ThemeArgsContext = React.createContext<ThemeArgsContextType>({
  update: (): void => {},
  theme: cactusTheme,
})

export function CactusProvider({ children }: React.PropsWithChildren<{}>): ReactElement {
  const [themeArgs, setThemeArgs] = useState<GeneratorOptions>({ primaryHue: 200 })
  const theme = useMemo((): CactusTheme => generateTheme(themeArgs), [themeArgs])
  const contextValue = useMemo((): ThemeArgsContextType => ({ theme, update: setThemeArgs }), [
    theme,
    setThemeArgs,
  ])
  return (
    <ThemeArgsContext.Provider value={contextValue}>
      <StyleProvider global theme={theme}>
        <>{children}</>
      </StyleProvider>
    </ThemeArgsContext.Provider>
  )
}

const Form = Box.withComponent('form')

export function CactusThemeWidget(): ReactElement {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isClosed, setIsClosed] = useState(true)
  const [values, setValues] = useState<{ [key: string]: any }>({
    primaryHue: 200,
    type: 'use_hue',
    primary: '',
    secondary: '',
  })
  const handleOnChange = (name: string, value: any): void => {
    setValues((v): { [k: string]: any } => ({ ...v, [name]: value }))
  }

  useEffect((): (() => void) => {
    function handleBodyClick(event: MouseEvent): void {
      if (
        formRef.current instanceof HTMLElement &&
        event.target instanceof HTMLElement &&
        !formRef.current.contains(event.target)
      ) {
        setIsClosed(true)
      }
    }

    document.body.addEventListener('click', handleBodyClick, false)
    return (): void => document.body.removeEventListener('click', handleBodyClick, false)
  }, [])

  if (isClosed) {
    return (
      <Flex position="fixed" bottom="10px" right="10px">
        <IconButton
          label="Update Theme"
          iconSize="medium"
          onClick={(): void => setIsClosed((closed): boolean => !closed)}
        >
          <ActionsGear aria-hidden="true" />
        </IconButton>
      </Flex>
    )
  }

  return (
    <ThemeArgsContext.Consumer>
      {({ update }): ReactElement => {
        const handleThemeSubmit = (event: FormEvent<HTMLFormElement>): void => {
          event.preventDefault()
          if (values.type === 'use_hue') {
            update({ primaryHue: parseInt(values.primaryHue) })
          } else {
            let { primary, secondary } = values
            update({ primary, secondary })
          }
        }

        const handleThemeDefault = (): void => {
          setValues({ type: 'use_hue', primaryHue: 200 })
          update({ primaryHue: 200 })
        }

        return (
          <Form
            ref={formRef}
            onSubmit={handleThemeSubmit}
            padding={3}
            position="fixed"
            bottom="10px"
            right="10px"
            maxWidth="calc(100vw - 20px)"
            maxHeight="calc(100vw - 20px)"
            backgroundColor="white"
            borderColor="darkContrast"
            borderWidth="1px"
            borderStyle="solid"
          >
            <Box>
              <RadioButtonField
                name="type"
                label="Use a single hue"
                value="use_hue"
                checked={values.type === 'use_hue'}
                onChange={handleOnChange}
              />
              <RadioButtonField
                name="type"
                label="Choose colors"
                value="two_colors"
                checked={values.type === 'two_colors'}
                onChange={handleOnChange}
              />
            </Box>
            {values.type === 'use_hue' ? (
              <Box>
                <AccessibleField name="primaryHue" label="Hue">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={values.primaryHue}
                    onChange={(e): void =>
                      handleOnChange(e.currentTarget.name, e.currentTarget.value)
                    }
                  />
                </AccessibleField>
                <Box
                  backgroundColor={`hsl(${values.primaryHue}, 96%, 35%)`}
                  width="20px"
                  height="20px"
                />
              </Box>
            ) : (
              <Box>
                <TextInputField
                  name="primary"
                  label="Primary Hex Color"
                  type="text"
                  value={values.primary}
                  onChange={handleOnChange}
                />
                <TextInputField
                  name="secondary"
                  label="Secondary Hex Color"
                  type="text"
                  value={values.secondary}
                  onChange={handleOnChange}
                />
              </Box>
            )}
            <Flex flexDirection="row-reverse" mt={4}>
              <Button type="submit" variant="action" ml={3}>
                Update
              </Button>
              <Button type="button" variant="standard" onClick={handleThemeDefault}>
                Default
              </Button>
            </Flex>
          </Form>
        )
      }}
    </ThemeArgsContext.Consumer>
  )
}

export function useCactusTheme(): CactusTheme {
  const { theme } = useContext(ThemeArgsContext)
  return theme
}
