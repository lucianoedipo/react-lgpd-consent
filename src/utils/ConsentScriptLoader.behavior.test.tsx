import * as React from 'react'
import { render, act } from '@testing-library/react'
import { ConsentScriptLoader } from './ConsentScriptLoader'
import { ConsentProvider } from '../context/ConsentContext'
import { createGoogleAnalyticsIntegration } from './scriptIntegrations'
import { useConsent } from '../hooks/useConsent'
import { logger } from './logger'

jest.mock('./scriptLoader', () => ({
  loadScript: jest.fn().mockResolvedValue(undefined),
}))

describe('ConsentScriptLoader behavior', () => {
  afterEach(() => jest.clearAllMocks())

  test('does not call loadScript when not consented', async () => {
    const integration = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })

    await act(async () => {
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })

    const { loadScript } = require('./scriptLoader')
    expect(loadScript).not.toHaveBeenCalled()
  })

  test('does not call loadScript when category is not allowed', async () => {
    const integration = { id: 'mkt', category: 'marketing', src: 'https://example.com/m.js' }
    const initialState = {
      consented: true,
      isModalOpen: false,
      preferences: { necessary: true, analytics: true, marketing: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics', 'marketing'] },
    }

    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics', 'marketing'] }}
          initialState={initialState as any}
        >
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })

    const { loadScript } = require('./scriptLoader')
    expect(loadScript).not.toHaveBeenCalled()
  })

  test('logs error when loadScript rejects', async () => {
    const { loadScript } = require('./scriptLoader')
    ;(loadScript as jest.Mock).mockRejectedValueOnce(new Error('network'))
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {})

    const integration = createGoogleAnalyticsIntegration({ measurementId: 'G-ERR' })
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

    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })

    expect(errorSpy).toHaveBeenCalled()
  })

  test('reloadOnChange toggles cause re-load when enabled, and not otherwise', async () => {
    function Controls() {
      const { setPreference } = useConsent()
      ;(global as any).__toggle = async () => {
        await act(async () => {
          setPreference('analytics' as any, false)
        })
        await act(async () => {
          setPreference('analytics' as any, true)
        })
      }
      return null
    }

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

    const integration = createGoogleAnalyticsIntegration({ measurementId: 'G-RELOAD' })
    const { loadScript } = require('./scriptLoader')

    // Case 1: reloadOnChange=false (default) => only initial load
    jest.clearAllMocks()
    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <Controls />
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })
    expect(loadScript).toHaveBeenCalledTimes(1)
    await (global as any).__toggle()
    expect(loadScript).toHaveBeenCalledTimes(1)

    // Case 2: reloadOnChange=true => loads again when re-enabled
    jest.clearAllMocks()
    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <Controls />
          <ConsentScriptLoader integrations={[integration]} reloadOnChange />
        </ConsentProvider>,
      )
    })
    expect(loadScript).toHaveBeenCalledTimes(1)
    await (global as any).__toggle()
    expect(loadScript).toHaveBeenCalledTimes(2)
  })
})

