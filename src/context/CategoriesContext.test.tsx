import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { CategoriesProvider, useCategories, useCategoryStatus } from './CategoriesContext'

// console.* é suprimido globalmente em jest.setup.ts

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
