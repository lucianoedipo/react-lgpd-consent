import { act, render, waitFor } from '@testing-library/react'
import * as React from 'react'
import { ConsentProvider } from '../../context/ConsentContext'
import { useConsent } from '../../hooks/useConsent'
import {
  __resetScriptRegistryForTests,
  ConsentScriptLoader,
  registerScript,
} from '../ConsentScriptLoader'
import { logger } from '../logger'
import type { ScriptIntegration } from '../scriptIntegrations'
import { createGoogleAnalyticsIntegration } from '../scriptIntegrations'

jest.mock('../scriptLoader', () => ({
  loadScript: jest.fn().mockResolvedValue(undefined),
}))

describe('ConsentScriptLoader behavior', () => {
  beforeEach(() => {
    document.cookie = ''
    ;(globalThis as any).window.dataLayer = []
    jest.clearAllMocks()
    __resetScriptRegistryForTests()
  })
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

    const { loadScript } = require('../scriptLoader')
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

    const { loadScript } = require('../scriptLoader')
    expect(loadScript).not.toHaveBeenCalled()
  })

  test('logs error when loadScript rejects', async () => {
    const { loadScript } = require('../scriptLoader')
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
    const { loadScript } = require('../scriptLoader')

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

    const firstRender = await act(async () => {
      return render(
        <ConsentProvider
          categories={{ enabledCategories: ['analytics'] }}
          initialState={initialState as any}
        >
          <Controls1 />
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      setPreferenceRef1.current('analytics' as any, false)
    })
    await act(async () => {
      setPreferenceRef1.current('analytics' as any, true)
    })

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledTimes(1)
    })

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

    firstRender.unmount()

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

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      setPreferenceRef2.current('analytics' as any, false)
    })
    await act(async () => {
      setPreferenceRef2.current('analytics' as any, true)
    })

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledTimes(2)
    })
  })

  test('non-necessary scripts load only after consent and respect partial preferences', async () => {
    document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.cookie = 'lgpd-consent__v1=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    const necessaryIntegration: ScriptIntegration = {
      id: 'essential-metrics',
      category: 'necessary',
      src: 'https://example.com/essential.js',
    }

    const analyticsIntegration = createGoogleAnalyticsIntegration({
      measurementId: 'G-CONSENT',
    })

    const marketingIntegration: ScriptIntegration = {
      id: 'marketing-suite',
      category: 'marketing',
      src: 'https://example.com/marketing.js',
    }

    const { loadScript } = require('../scriptLoader')
    jest.clearAllMocks()

    const controlsRef = {
      current: null as null | {
        setPreferences: ReturnType<typeof useConsent>['setPreferences']
      },
    }

    const Controls = () => {
      const { setPreferences } = useConsent()
      React.useEffect(() => {
        controlsRef.current = { setPreferences }
      }, [setPreferences])
      return null
    }

    await act(async () => {
      render(
        <ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing'] }}>
          <Controls />
          <ConsentScriptLoader
            integrations={[necessaryIntegration, analyticsIntegration, marketingIntegration]}
          />
        </ConsentProvider>,
      )
    })

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledWith(
        'essential-metrics',
        'https://example.com/essential.js',
        'necessary',
        expect.any(Object),
        undefined,
        expect.objectContaining({ skipConsentCheck: true }),
      )
    })
    ;(loadScript as jest.Mock).mockClear()

    // Aguarda Controls registrar o ref
    await waitFor(() => {
      expect(controlsRef.current).not.toBeNull()
    })

    // Força consentimento parcial (analytics permitido, marketing negado)
    await act(async () => {
      controlsRef.current?.setPreferences({
        necessary: true,
        analytics: true,
        marketing: false,
      })
    })

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledTimes(1)
    })

    const firstWaveIds = (loadScript as jest.Mock).mock.calls.map((call) => call[0])
    expect(firstWaveIds).toContain('google-analytics')
    expect(firstWaveIds).not.toContain('marketing-suite')

    // Posteriormente, usuário habilita marketing -> deve carregar apenas o script pendente
    await act(async () => {
      controlsRef.current?.setPreferences({
        necessary: true,
        analytics: true,
        marketing: true,
      })
    })

    await waitFor(() => {
      const ids = (loadScript as jest.Mock).mock.calls.map((call) => call[0])
      expect(ids).toContain('marketing-suite')
    })

    const finalCalls = (loadScript as jest.Mock).mock.calls.map((call) => call[0])
    expect(finalCalls.filter((id: string) => id === 'marketing-suite')).toHaveLength(1)
    expect(finalCalls.filter((id: string) => id === 'google-analytics')).toHaveLength(1)
  })

  test('registerScript mantém fila até consentimento e respeita prioridade', async () => {
    const executionOrder: string[] = []
    const cleanupLow = registerScript({
      id: 'inline-low',
      category: 'analytics',
      priority: 0,
      execute: () => {
        executionOrder.push('low')
      },
    })
    const cleanupHigh = registerScript({
      id: 'inline-high',
      category: 'analytics',
      priority: 5,
      execute: () => {
        executionOrder.push('high')
      },
    })

    const controlsRef = {
      current: null as null | { acceptAll: ReturnType<typeof useConsent>['acceptAll'] },
    }
    const Controls = () => {
      const { acceptAll } = useConsent()
      React.useEffect(() => {
        controlsRef.current = { acceptAll }
      }, [acceptAll])
      return null
    }

    const initialState = {
      consented: false,
      isModalOpen: false,
      preferences: { necessary: true, analytics: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      projectConfig: { enabledCategories: ['analytics'] },
    }

    const renderResult = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState as any}
      >
        <Controls />
        <ConsentScriptLoader integrations={[]} />
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect(executionOrder).toEqual([])
    })

    await act(async () => {
      controlsRef.current?.acceptAll()
    })

    await waitFor(() => {
      expect(executionOrder).toEqual(['high', 'low'])
    })

    cleanupLow()
    cleanupHigh()
    renderResult.unmount()
  })

  test('GA4 envia consent mode v2 (default denied -> update) via ConsentScriptLoader', async () => {
    const integration = createGoogleAnalyticsIntegration({ measurementId: 'G-CMODE' })
    const { loadScript } = require('../scriptLoader')
    ;(globalThis as any).window.dataLayer = []

    const controlsRef = {
      current: null as null | { acceptAll: ReturnType<typeof useConsent>['acceptAll'] },
    }
    const Controls = () => {
      const { acceptAll } = useConsent()
      React.useEffect(() => {
        controlsRef.current = { acceptAll }
      }, [acceptAll])
      return null
    }

    const initialState = {
      consented: false,
      isModalOpen: false,
      preferences: { necessary: true, analytics: false },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      projectConfig: { enabledCategories: ['analytics'] },
    }

    render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState as any}
      >
        <Controls />
        <ConsentScriptLoader integrations={[integration]} />
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect((globalThis as any).window.dataLayer[0][1]).toBe('default')
      expect((globalThis as any).window.dataLayer[0][2]).toMatchObject({
        analytics_storage: 'denied',
        ad_storage: 'denied',
      })
    })

    expect(loadScript).not.toHaveBeenCalled()

    await act(async () => {
      controlsRef.current?.acceptAll()
    })

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalled()
    })

    await waitFor(() => {
      const last = (globalThis as any).window.dataLayer[
        (globalThis as any).window.dataLayer.length - 1
      ] as any[]
      expect(last[1]).toBe('update')
      expect(last[2]).toMatchObject({
        analytics_storage: 'granted',
      })
    })
  })
})
