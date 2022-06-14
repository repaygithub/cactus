import { NavigationChevronLeft, NavigationChevronRight, NavigationClose } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { height, HeightProps, margin, MarginProps, width, WidthProps } from 'styled-system'

import Dimmer from '../Dimmer/Dimmer'
import Flex from '../Flex/Flex'
import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { boxShadow, radius } from '../helpers/theme'
import IconButton from '../IconButton/IconButton'

interface PreviewProps
  extends MarginProps,
    WidthProps,
    HeightProps,
    FlexItemProps,
    React.HTMLAttributes<HTMLDivElement> {
  images?: string[]
  phrases?: Phrases
}

interface Phrases {
  previous?: string
  next?: string
  close?: string
}

const DEFAULT_PHRASES: Phrases = {
  previous: 'Go to the previous image',
  next: 'Go to the next image',
  close: 'Close the image',
}

export const Preview = React.forwardRef<HTMLDivElement, PreviewProps>(
  ({ images = [], children, phrases: passedPhrases, ...rest }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState<number>(0)
    const [imageSelected, setImageSelected] = React.useState<boolean>(false)
    const selectedImageRef = React.useRef<HTMLImageElement | null>(null)
    const closeButtonRef = React.useRef<HTMLButtonElement | null>(null)
    const imgComponents = images.length
      ? images.map((src) => <img src={src} />)
      : React.Children.toArray(children)
    const multipleImages = imgComponents.length > 1
    const phrases = { ...DEFAULT_PHRASES, ...passedPhrases }

    React.useEffect(() => {
      // REACT18-COMPAT: This could theoretically cause issues when remounting,
      // but I don't think it's likely give how focusing the image takes over
      // the screen: any interaction likely to "hide" the component will also
      // likely close the selected image.
      if (imageSelected) {
        closeButtonRef.current?.focus()
      }

      const handleBodyClick = (event: MouseEvent): void => {
        const { target } = event
        if (
          target instanceof Node &&
          imageSelected &&
          !selectedImageRef?.current?.contains(target)
        ) {
          setImageSelected(false)
        }
      }

      const handleBodyKeyDown = (event: KeyboardEvent) => {
        if (imageSelected && event.key === 'Escape') {
          setImageSelected(false)
        }
      }

      document.body.addEventListener('click', handleBodyClick)
      document.body.addEventListener('keydown', handleBodyKeyDown)

      return () => {
        document.body.removeEventListener('click', handleBodyClick)
        document.body.removeEventListener('keydown', handleBodyKeyDown)
      }
    }, [imageSelected])

    const handleLeftArrowClick = () => {
      setCurrentIndex((index) => index - 1)
    }

    const handleRightArrowClick = () => {
      setCurrentIndex((index) => index + 1)
    }

    const handleImageClick = () => {
      setImageSelected(true)
    }

    return (
      <PreviewBox ref={ref} justify={multipleImages ? 'space-between' : 'center'} {...rest}>
        {multipleImages && (
          <IconButton
            onClick={handleLeftArrowClick}
            onKeyDown={keyDownAsClick}
            onKeyUp={preventAction}
            disabled={currentIndex === 0}
            label={phrases.previous}
          >
            <NavigationChevronLeft aria-hidden="true" />
          </IconButton>
        )}
        {React.cloneElement(imgComponents[currentIndex] as JSX.Element, {
          onClick: handleImageClick,
          onKeyDown: keyDownAsClick,
          onKeyUp: preventAction,
          tabIndex: 0,
        })}
        {multipleImages && (
          <IconButton
            onClick={handleRightArrowClick}
            onKeyDown={keyDownAsClick}
            onKeyUp={preventAction}
            disabled={currentIndex === imgComponents.length - 1}
            label={phrases.next}
          >
            <NavigationChevronRight aria-hidden="true" />
          </IconButton>
        )}
        {imageSelected && (
          <Dimmer active>
            <Flex height="100%" flexDirection="column" alignItems="center" justifyContent="center">
              <ScrollWrapper>
                <Flex width="100%" mb={4}>
                  <StyledIconButton
                    ref={closeButtonRef}
                    ml="auto"
                    onKeyDown={keyDownAsClick}
                    onKeyUp={preventAction}
                    label={phrases.close}
                    variant="action"
                  >
                    <NavigationClose aria-hidden="true" />
                  </StyledIconButton>
                </Flex>
                <ImageBackground>
                  {React.cloneElement(imgComponents[currentIndex] as JSX.Element, {
                    ref: selectedImageRef,
                    tabIndex: 0,
                  })}
                </ImageBackground>
              </ScrollWrapper>
            </Flex>
          </Dimmer>
        )}
      </PreviewBox>
    )
  }
)

const ImageBackground = styled.div`
  display: flex;
  background-color: ${(p) => p.theme.colors.white};
`

const PreviewBox = styled.div<{ justify: 'space-between' | 'center' }>`
  box-sizing: border-box;
  padding-left: ${(p) => p.theme.space[7]}px;
  padding-right: ${(p) => p.theme.space[7]}px;
  background-color: ${(p) => p.theme.colors.lightContrast};
  border-radius: ${radius(8)};
  min-height: 200px;
  min-width: 50%;
  width: 50%;
  height: 440px;
  ${width}
  ${height}
  display: flex;
  justify-content: ${(p) => p.justify};
  align-items: center;
  ${margin}
  ${flexItem}

  img {
    display: inline;
    max-width: 80%;
    max-height: 80%;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: ${radius(8)};
    ${(p) => boxShadow(p.theme, 2)}
  }

  ${ImageBackground} img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    box-shadow: none;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
  }
`

const ScrollWrapper = styled.div`
  max-width: 80%;
  max-height: 100%;
  overflow: auto;
  padding: ${(p) => p.theme.space[3]}px;
`

const StyledIconButton = styled(IconButton)`
  color: ${(p) => p.theme.colors.white};

  &:hover {
    color: ${(p) => p.theme.colors.white};
  }
`

Preview.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string.isRequired),
  // @ts-ignore
  phrases: PropTypes.shape({
    previous: PropTypes.string,
    next: PropTypes.string,
    close: PropTypes.string,
  }),
}
Preview.displayName = 'Preview'

export default Preview
