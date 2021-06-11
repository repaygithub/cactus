import { act, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Breadcrumb from './Breadcrumb'

describe('Breadcrumb:', (): void => {
  test('should have label and href', (): void => {
    const { getAllByText } = render(
      <StyleProvider>
        <Breadcrumb>
          <Breadcrumb.Item href="www.github.com">Link2</Breadcrumb.Item>
        </Breadcrumb>
      </StyleProvider>
    )

    expect(getAllByText('Link2')[0]).toBeInTheDocument()
    expect(document.querySelector('a')).toHaveAttribute('href', 'www.github.com')
  })

  describe('mobile', () => {
    describe('mouse interactions', () => {
      test('should open a dropdown when the first breadcrumb is clicked', () => {
        const { getByRole, getAllByText } = render(
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

        const firstBreadcrumb = getByRole('button', { name: 'Link 1' })
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        act(() => userEvent.click(firstBreadcrumb))
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should open a dropdown when the ellipsis button is clicked', () => {
        const { getAllByText, getByRole } = render(
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

        const ellipsisButton = getByRole('button', { name: '...' })
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        act(() => userEvent.click(ellipsisButton))
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should be able to select an option from the dropdown', () => {
        const onLinkClick = jest.fn()
        const { getAllByText, getByRole } = render(
          <StyleProvider>
            <ScreenSizeContext.Provider value={SIZES.tiny}>
              <Breadcrumb>
                <Breadcrumb.Item href="www.github.com">Link 1</Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com" onClick={onLinkClick}>
                  Link 2
                </Breadcrumb.Item>
                <Breadcrumb.Item href="www.github.com">Link 3</Breadcrumb.Item>
              </Breadcrumb>
            </ScreenSizeContext.Provider>
          </StyleProvider>
        )

        const firstBreadcrumb = getByRole('button', { name: 'Link 1' })
        act(() => userEvent.click(firstBreadcrumb))
        const link2 = getAllByText('Link 2')[0]
        userEvent.click(link2)
        expect(onLinkClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('keyboard interactions', () => {
      test('should open a dropdown when the SPACE is pressed on the first breadcrumb', async () => {
        const { getAllByText, getByRole } = render(
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

        const firstBreadcrumb = getByRole('button', { name: 'Link 1' })
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        fireEvent.focus(firstBreadcrumb)
        fireEvent.keyDown(firstBreadcrumb, { key: ' ' })
        expect(popupBreadcrumbLink).toBeVisible()
      })

      test('should open a dropdown when SPACE is pressed on the ellipsis button', () => {
        const { getAllByText, getByRole } = render(
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

        const ellipsisButton = getByRole('button', { name: '...' })
        const popupBreadcrumbLink = getAllByText('Link 1')[1]
        expect(popupBreadcrumbLink).not.toBeVisible()
        fireEvent.focus(ellipsisButton)
        fireEvent.keyDown(ellipsisButton, { key: ' ' })
        expect(popupBreadcrumbLink).toBeVisible()
      })

      /* NOTE
       * Similar to the MenuBar, the logic for managing the focus in the dropdown relies
       * on the elements being "visible", so that logic doesn't work in unit tests.
       */
    })
  })
})
