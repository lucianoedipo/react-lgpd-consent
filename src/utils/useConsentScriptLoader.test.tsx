import * as React from 'react'
import { render, act } from '@testing-library/react'
import { useConsentScriptLoader } from './ConsentScriptLoader'
import { ConsentProvider } from '../context/ConsentContext'

// mock loadScript
jest.mock('./scriptLoader', () => ({
  loadScript: jest.fn().mockResolvedValue(undefined),
}))

describe('useConsentScriptLoader', () => {
  function TestComponent({ integration }: any) {
    const load = useConsentScriptLoader()
    React.useEffect(() => {
      load(integration)
    }, [integration, load])
    return null
  }

  // console.* é suprimido globalmente em jest.setup.ts
  afterAll(() => jest.restoreAllMocks())

  test('does not load when not consented', async () => {
    const integration = { id: 'x', category: 'analytics', src: 'ok' }

    await act(async () => {
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
          <TestComponent integration={integration} />
        </ConsentProvider>,
      )
    })

    // since default state is not consented, mocked loadScript should not have been called
    const { loadScript } = require('./scriptLoader')
    expect(loadScript).not.toHaveBeenCalled()
  })

  test('loads when consented and category allowed', async () => {
    const integration = { id: 'x', category: 'analytics', src: 'ok' }

    // Provide initialState with consented true and preferences
    const initialState = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics'] },
    }

    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <TestComponent integration={integration} />
        </ConsentProvider>,
      )
    })

    const { loadScript } = require('./scriptLoader')
    expect(loadScript).toHaveBeenCalled()
  })
})
