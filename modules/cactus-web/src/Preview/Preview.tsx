import { NavigationChevronLeft, NavigationChevronRight, NavigationClose } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { height, HeightProps, margin, MarginProps, width, WidthProps } from 'styled-system'

import Dimmer from '../Dimmer/Dimmer'
import Flex from '../Flex/Flex'
import { keyDownAsClick } from '../helpers/a11y'
import { boxShadow, radius } from '../helpers/theme'
import IconButton from '../IconButton/IconButton'

interface PreviewProps
  extends MarginProps,
    WidthProps,
    HeightProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'onFocus' | 'onBlur'> {
  images?: string[]
  phrases?: Phrases
}

interface Phrases {
  previous: string
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
    const imagesFromChildren = images.length === 0 && !!children
    const childrenArray = React.Children.toArray(children)
    const multipleImages = imagesFromChildren ? childrenArray.length > 1 : images.length > 1
    const phrases = { ...DEFAULT_PHRASES, ...passedPhrases }

    React.useEffect(() => {
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
      document.body.addEventListener('click', handleBodyClick)

      return () => {
        document.body.removeEventListener('click', handleBodyClick)
      }
    }, [imageSelected])

    React.useEffect(() => {
      if (imageSelected !== null) {
        closeButtonRef.current?.focus()
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
            disabled={currentIndex === 0}
            label={phrases.previous}
          >
            <NavigationChevronLeft aria-hidden="true" />
          </IconButton>
        )}
        {imagesFromChildren ? (
          React.cloneElement(childrenArray[currentIndex] as JSX.Element, {
            onClick: handleImageClick,
            onKeyDown: keyDownAsClick,
            tabIndex: 0,
            'data-selected': 'false',
          })
        ) : (
          <img
            src={images[currentIndex]}
            onClick={handleImageClick}
            onKeyDown={keyDownAsClick}
            tabIndex={0}
            data-selected="false"
          />
        )}
        {multipleImages && (
          <IconButton
            onClick={handleRightArrowClick}
            onKeyDown={keyDownAsClick}
            disabled={
              imagesFromChildren
                ? currentIndex === childrenArray.length - 1
                : currentIndex === images.length - 1
            }
            label={phrases.next}
          >
            <NavigationChevronRight aria-hidden="true" />
          </IconButton>
        )}
        {imageSelected && (
          <Dimmer active>
            <Flex flexDirection="column" alignItems="center">
              <Flex width="50%" mb={4}>
                <StyledIconButton
                  ref={closeButtonRef}
                  ml="auto"
                  onKeyDown={keyDownAsClick}
                  label={phrases.close}
                  variant="action"
                >
                  <NavigationClose aria-hidden="true" />
                </StyledIconButton>
              </Flex>
              {imagesFromChildren ? (
                <ImageBackground>
                  {React.cloneElement(childrenArray[currentIndex] as JSX.Element, {
                    ref: selectedImageRef,
                    'data-selected': 'true',
                    tabIndex: 0,
                  })}
                </ImageBackground>
              ) : (
                <ImageBackground>
                  <img
                    ref={selectedImageRef}
                    src={images[currentIndex]}
                    data-selected="true"
                    tabIndex={0}
                  />
                </ImageBackground>
              )}
            </Flex>
          </Dimmer>
        )}
      </PreviewBox>
    )
  }
)

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

  img[data-selected='false'] {
    display: inline;
    max-width: 80%;
    max-height: 80%;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: ${radius(8)};
    ${(p) => boxShadow(p.theme, 2)}
  }

  img[data-selected='true'] {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
  }
`

const ImageBackground = styled.div`
  display: flex;
  width: 50%;
  background-color: ${(p) => p.theme.colors.white};
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