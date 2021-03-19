import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Breadcrumb from './Breadcrumb'

describe('Breadcrumb:', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <Breadcrumb>
          <Breadcrumb.Item href="www.github.com">Link2</Breadcrumb.Item>
          <Breadcrumb.Item href="www.repay.com" active>
            Link2
          </Breadcrumb.Item>
        </Breadcrumb>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should have label and href', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Breadcrumb>
          <Breadcrumb.Item href="www.github.com">Link2</Breadcrumb.Item>
        </Breadcrumb>
      </StyleProvider>
    )

    expect(getByText('Link2')).toBeInTheDocument()
    expect(document.querySelector('a')).toHaveAttribute('href', 'www.github.com')
  })

  describe('mobile', () => {
    describe('mouse interactions', () => {
      test('should open a dropdown when the first breadcrumb is clicked', () => {
        const { getAllByText } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com">Link 1</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 2</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const firstBreadcrumb = getAllByText('Link 1')[0]
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        userEvent.click(firstBreadcrumb)
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should open a dropdown when the ellipsis button is clicked', () => {
        const { getByText, getAllByText } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com">Link 1</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 2</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const ellipsisButton = getByText('...')
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        userEvent.click(ellipsisButton)
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should be able to select an option from the dropdown', () => {
        const onLink1Click = jest.fn()
        const onLink2Click = jest.fn()
        const { getByText, getAllByText } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com" onClick={onLink1Click}>
                  Link 1
                </Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com" onClick={onLink2Click}>
                  Link 2
                </Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const firstBreadcrumb = getAllByText('Link 1')[0]
        userEvent.click(firstBreadcrumb)
        const link2 = getByText('Link 2')
        userEvent.click(link2)
        expect(onLink1Click).not.toHaveBeenCalled()
        expect(onLink2Click).toHaveBeenCalledTimes(1)
      })
    })

    describe('keyboard interactions', () => {
      test('should open a dropdown when the first breadcrumb is clicked', () => {
        const { getAllByText } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com">Link 1</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 2</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const firstBreadcrumb = getAllByText('Link 1')[0]
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        fireEvent.focus(firstBreadcrumb)
        userEvent.type(firstBreadcrumb, '{space}')
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should open a dropdown when the ellipsis button is clicked', () => {
        const { getByText, getAllByText } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com">Link 1</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 2</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const ellipsisButton = getByText('...')
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        fireEvent.focus(ellipsisButton)
        userEvent.type(ellipsisButton, '{space}')
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should be able to select an option from the dropdown', () => {
        const onLink1Click = jest.fn()
        const onLink2Click = jest.fn()
        const { getAllByText } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com" onClick={onLink1Click}>
                  Link 1
                </Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com" onClick={onLink2Click}>
                  Link 2
                </Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const firstBreadcrumb = getAllByText('Link 1')[0]
        fireEvent.focus(firstBreadcrumb)
        userEvent.click(firstBreadcrumb)
        const activeElement = document.activeElement as Element
        userEvent.type(activeElement, '{arrowdown}')
        userEvent.type(activeElement, '{space}')
        expect(onLink1Click).not.toHaveBeenCalled()
        expect(onLink2Click).toHaveBeenCalledTimes(1)
      })
    })
  })
})
