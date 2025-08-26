import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { ConsentProvider } from '../context/ConsentContext'
import { ConsentGate } from './ConsentGate'

describe('ConsentGate', () => {
  // console.* é suprimido globalmente em jest.setup.ts
  test('renders children when category preference is true', () => {
    const initialState = {
      consented: true,
      isModalOpen: false,
      preferences: { necessary: true, analytics: true },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics'] },
    }

    render(
      <ConsentProvider initialState={initialState as any}>
        <ConsentGate category="analytics">
          <div data-testid="inside">OK</div>
        </ConsentGate>
      </ConsentProvider>,
    )

    expect(screen.getByTestId('inside')).toBeTruthy()
  })

  test('does not render children when category preference is false', () => {
    const initialState = {
      consented: true,
      isModalOpen: false,
      preferences: { necessary: true, analytics: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics'] },
    }

    render(
      <ConsentProvider initialState={initialState as any}>
        <ConsentGate category="analytics">
          <div data-testid="inside-fail">NO</div>
        </ConsentGate>
      </ConsentProvider>,
    )

    expect(screen.queryByTestId('inside-fail')).toBeNull()
  })
})
