import React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { Position } from './grid'
import { Layout, useLayout } from './Layout'

const LayoutItem = ({ role, order, ...position }: { role: string; order?: number } & Position) => {
  const layoutClass = useLayout(role, position, order)
  return (
    <div className={layoutClass} data-testid="test-component">
      test
    </div>
  )
}
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})
describe('useLayout tests', () => {
  describe('Grid', () => {
    test('Header classes and role', async () => {
      const { getByTestId } = renderWithTheme(
        <Layout>
          <LayoutItem role="header" grid="header" col={3} colEnd={-2} />
        </Layout>
      )
      const testElement = getByTestId('test-component')

      expect(testElement.classList.contains('cactus-layout-header')).toBe(true)
      expect(testElement.classList.contains('cactus-grid-header')).toBe(true)
      const style = window.getComputedStyle(testElement)
      expect(style.gridColumn).toBe('3')
    })
    test('Content component classes and role', async () => {
      const { getByTestId } = renderWithTheme(
        <Layout>
          <LayoutItem role="testComponent" />
        </Layout>
      )
      const testElement = getByTestId('test-component')

      expect(testElement.classList.contains('cactus-layout-testComponent')).toBe(true)
      expect(testElement.classList.contains('cactus-grid-component')).toBe(true)
      const style = window.getComputedStyle(testElement)

      expect(style.gridColumn).toBe('1')
      expect(style.gridRow).toBe('1')
      expect(style.display).toBe('block')
    })
  })
  describe('Fixed', () => {
    test('Fixed bottom classes and role', async () => {
      const { container, getByTestId } = renderWithTheme(
        <Layout>
          <LayoutItem role="bottom" fixed="bottom" />
        </Layout>
      )

      expect(getByTestId('test-component').classList.contains('cactus-layout-bottom')).toBe(true)
      expect(getByTestId('test-component').classList.contains('cactus-fixed-bottom')).toBe(true)
      const testElement = container.querySelector('.cactus-layout-bottom')
      const style = window.getComputedStyle(testElement as Element)

      expect(style.position).toBe('fixed')
      expect(style.left).toBe('0px')
      expect(style.right).toBe('0px')
      expect(style.bottom).toBe('0px')
    })
    test('Fixed right classes and role', async () => {
      const { container, getByTestId } = renderWithTheme(
        <Layout>
          <LayoutItem role="right" fixed="right" size={20} />
        </Layout>
      )

      expect(getByTestId('test-component').classList.contains('cactus-layout-right')).toBe(true)
      expect(getByTestId('test-component').classList.contains('cactus-fixed-right')).toBe(true)
      const testElement = container.querySelector('.cactus-layout-right')
      const style = window.getComputedStyle(testElement as Element)
      expect(style.position).toBe('fixed')
      expect(style.right).toBe('0px')
      expect(style.bottom).toBe('0px')
      expect(style.display).toBe('block')
      expect(style.width).toBe('20px')
    })
  })
})
