import { act, render, waitFor } from '@testing-library/react'
import { ConsentProvider } from '../../context/ConsentContext'
import * as autoConfig from '../autoConfigureCategories'
import { ConsentScriptLoader } from '../ConsentScriptLoader'
import * as scriptLoaderModule from '../ConsentScriptLoader'
import { createGoogleAnalyticsIntegration } from '../scriptIntegrations'

jest.mock('../scriptLoader', () => ({
  loadScript: jest.fn().mockResolvedValue(undefined),
}))

describe('ConsentScriptLoader component', () => {
  // Suprimir logs do developerGuidance durante estes testes
  // console.* é suprimido globalmente em jest.setup.ts
  afterAll(() => jest.restoreAllMocks())

  test('calls loadScript for enabled integrations when consented', async () => {
    const integration = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })

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
          <ConsentScriptLoader integrations={[integration]} />
        </ConsentProvider>,
      )
    })

    const { loadScript } = require('../scriptLoader')

    // Aguardar o setTimeout(0) do ConsentScriptLoader
    await waitFor(() => {
      expect(loadScript).toHaveBeenCalled()
    })
  })

  test('applies nonce prop to scripts', async () => {
    const integration = createGoogleAnalyticsIntegration({ measurementId: 'G-NONCE' })

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
          <ConsentScriptLoader integrations={[integration]} nonce="nonce-abc" />
        </ConsentProvider>,
      )
    })

    const { loadScript } = require('../scriptLoader')

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalledWith(
        integration.id,
        integration.src,
        integration.category,
        expect.objectContaining({ nonce: 'nonce-abc' }),
        'nonce-abc',
        expect.objectContaining({ skipConsentCheck: true }),
      )
    })
  })

  test('nao re-registra integracoes inalteradas e re-registra apos remover', async () => {
    scriptLoaderModule.__resetScriptRegistryForTests()

    const integration = {
      id: 'custom-analytics',
      category: 'analytics' as const,
      src: 'https://example.com/custom.js',
      bootstrap: jest.fn(),
      init: jest.fn(),
    }

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

    const { rerender } = render(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState as any}
      >
        <ConsentScriptLoader integrations={[{ ...integration }]} />
      </ConsentProvider>,
    )

    const { loadScript } = require('../scriptLoader')
    ;(loadScript as jest.Mock).mockClear()

    await waitFor(() => {
      expect(loadScript).toHaveBeenCalled()
      expect(integration.bootstrap).toHaveBeenCalled()
      expect(integration.init).toHaveBeenCalled()
    })
    const initialLoadCalls = (loadScript as jest.Mock).mock.calls.length
    const initialBootstrapCalls = integration.bootstrap.mock.calls.length

    rerender(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState as any}
      >
        <ConsentScriptLoader integrations={[{ ...integration }]} />
      </ConsentProvider>,
    )

    rerender(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState as any}
      >
        <ConsentScriptLoader integrations={[]} />
      </ConsentProvider>,
    )

    rerender(
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState as any}
      >
        <ConsentScriptLoader integrations={[{ ...integration }]} />
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect((loadScript as jest.Mock).mock.calls.length).toBeGreaterThan(initialLoadCalls)
      expect(integration.bootstrap.mock.calls.length).toBeGreaterThan(initialBootstrapCalls)
      expect(integration.init.mock.calls.length).toBeGreaterThan(0)
    })
  })
})

describe('ConsentScriptLoader developer validation', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    jest.restoreAllMocks()
  })

  test('invoca autoConfigureCategories quando validação de categorias falha', async () => {
    const integration = {
      id: 'ads-script',
      category: 'marketing',
      src: 'https://example.com/ads.js',
    }

    const validateCategoriesSpy = jest
      .spyOn(autoConfig, 'validateIntegrationCategories')
      .mockReturnValue(false)
    const necessarySpy = jest
      .spyOn(autoConfig, 'validateNecessaryClassification')
      .mockReturnValue([])
    const autoSpy = jest.spyOn(autoConfig, 'autoConfigureCategories')

    render(
      <ConsentProvider categories={{ enabledCategories: ['analytics'] }}>
        <ConsentScriptLoader integrations={[integration]} />
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect(autoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          enabledCategories: ['analytics'],
        }),
        expect.arrayContaining([expect.objectContaining({ id: 'ads-script' })]),
        expect.objectContaining({ warningOnly: true, silent: false }),
      )
    })

    expect(validateCategoriesSpy).toHaveBeenCalled()
    expect(necessarySpy).toHaveBeenCalled()
  })

  test('classificação incorreta como necessary emite logs detalhados', async () => {
    jest.spyOn(autoConfig, 'validateIntegrationCategories').mockReturnValue(true)
    jest
      .spyOn(autoConfig, 'validateNecessaryClassification')
      .mockReturnValue([
        '⚠️ Script google-analytics não pode ser marcado como necessary',
        '💡 Habilite categoria analytics para o GA',
        'Mensagem adicional sem prefixo específico',
      ])

    const groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
    const groupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <ConsentProvider categories={{ enabledCategories: ['necessary'] }}>
        <ConsentScriptLoader
          integrations={[
            {
              id: 'google-analytics',
              category: 'necessary',
              src: 'https://example.com/ga.js',
            },
          ]}
        />
      </ConsentProvider>,
    )

    await waitFor(() => {
      expect(groupSpy).toHaveBeenCalledWith('🚨 [LGPD-CONSENT] VALIDAÇÃO DE COMPLIANCE')
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('google-analytics não pode ser marcado'),
      )
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Habilite categoria analytics'))
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Mensagem adicional'))
      expect(groupEndSpy).toHaveBeenCalled()
    })

    groupSpy.mockRestore()
    groupEndSpy.mockRestore()
    errorSpy.mockRestore()
    warnSpy.mockRestore()
    logSpy.mockRestore()
  })
})
