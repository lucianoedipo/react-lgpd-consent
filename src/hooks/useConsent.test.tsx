import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsentProvider } from '../context/ConsentContext'
import { useConsent } from './useConsent'

function TestConsumer() {
  const { preferences, acceptAll, rejectAll, setPreference } = useConsent()

  return (
    <div>
      <div data-testid="preferences">{JSON.stringify(preferences)}</div>
      <button onClick={() => acceptAll()} data-testid="accept-all">
        accept
      </button>
      <button onClick={() => rejectAll()} data-testid="reject-all">
        reject
      </button>
      <button onClick={() => setPreference('analytics', true)} data-testid="set-analytics-true">
        set-analytics
      </button>
    </div>
  )
}

describe('useConsent hook', () => {
  // console.* é suprimido globalmente em jest.setup.ts
  test('acceptAll and rejectAll update preferences', async () => {
    const initialState = {
      consented: false,
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
        <TestConsumer />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('preferences').textContent).toContain('analytics":false')

    await userEvent.click(screen.getByTestId('accept-all'))
    expect(screen.getByTestId('preferences').textContent).toContain('analytics":true')

    await userEvent.click(screen.getByTestId('reject-all'))
    expect(screen.getByTestId('preferences').textContent).toContain('analytics":false')
  })

  test('setPreference updates single category', async () => {
    const initialState = {
      consented: false,
      isModalOpen: false,
      preferences: { necessary: true, analytics: false, marketing: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics', 'marketing'] },
    }

    render(
      <ConsentProvider initialState={initialState as any}>
        <TestConsumer />
      </ConsentProvider>,
    )

    expect(screen.getByTestId('preferences').textContent).toContain('marketing":false')
    await userEvent.click(screen.getByTestId('set-analytics-true'))
    expect(screen.getByTestId('preferences').textContent).toContain('analytics":true')
  })
})
