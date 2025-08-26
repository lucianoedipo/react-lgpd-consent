import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { CategoriesProvider, useCategories, useCategoryStatus } from './CategoriesContext'

// Suppress developer guidance logs for tests in this file
beforeAll(() => {
  jest.spyOn(console, 'group').mockImplementation(() => undefined)
  jest.spyOn(console, 'log').mockImplementation(() => undefined)
  jest.spyOn(console, 'info').mockImplementation(() => undefined)
  jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
})
afterAll(() => jest.restoreAllMocks())

function CategoriesConsumer() {
  const categories = useCategories()
  return <div data-testid="categories">{JSON.stringify(categories)}</div>
}

function CategoryStatusConsumer({ category }: { readonly category: string }) {
  const status = useCategoryStatus(category)
  return <div data-testid={`status-${category}`}>{JSON.stringify(status)}</div>
}

describe('CategoriesContext', () => {
  test('provides categories shape', () => {
    render(
      <CategoriesProvider>
        <CategoriesConsumer />
      </CategoriesProvider>,
    )

    expect(screen.getByTestId('categories').textContent).toContain('allCategories')
  })

  test('useCategoryStatus returns expected keys', () => {
    render(
      <CategoriesProvider>
        <CategoryStatusConsumer category="necessary" />
      </CategoriesProvider>,
    )

    const txt = screen.getByTestId('status-necessary').textContent || ''
    expect(txt).toContain('isEssential')
    expect(txt).toContain('needsToggle')
  })
})
