import { act, render } from '@testing-library/react'
import * as React from 'react'
import { ConsentProvider } from '../context/ConsentContext'
import { useConsent } from '../hooks/useConsent'
import { ConsentScriptLoader } from './ConsentScriptLoader'
import { logger } from './logger'
import type { ScriptIntegration } from './scriptIntegrations'
import { createGoogleAnalyticsIntegration } from './scriptIntegrations'

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
    const integration: ScriptIntegration = {
      id: 'mkt',
      category: 'marketing',
      src: 'https://example.com/m.js',
    }
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
    const setPreferenceRef1 = { current: null as any }
    const Controls1 = () => {
      const { setPreference } = useConsent()
      React.useEffect(() => {
        setPreferenceRef1.current = setPreference
      }, [setPreference])
      return null
    }

    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <Controls1 />
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })
    expect(loadScript).toHaveBeenCalledTimes(1)

    await act(async () => {
      setPreferenceRef1.current('analytics' as any, false)
    })
    await act(async () => {
      setPreferenceRef1.current('analytics' as any, true)
    })
    expect(loadScript).toHaveBeenCalledTimes(1)

    // Case 2: reloadOnChange=true => loads again when re-enabled
    jest.clearAllMocks()
    const setPreferenceRef2 = { current: null as any }
    const Controls2 = () => {
      const { setPreference } = useConsent()
      React.useEffect(() => {
        setPreferenceRef2.current = setPreference
      }, [setPreference])
      return null
    }

    await act(async () => {
      render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <Controls2 />
          <ConsentScriptLoader integrations={[integration]} reloadOnChange />
        </ConsentProvider>,
      )
    })
    expect(loadScript).toHaveBeenCalledTimes(1)

    await act(async () => {
      setPreferenceRef2.current('analytics' as any, false)
    })
    await act(async () => {
      setPreferenceRef2.current('analytics' as any, true)
    })
    expect(loadScript).toHaveBeenCalledTimes(2)
  })
})
