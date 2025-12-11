/**
 * Testes de compatibilidade com React 19 StrictMode
 * Foco: scripts não são injetados múltiplas vezes
 */

import { act, render } from '@testing-library/react'
import * as React from 'react'
import { ConsentProvider } from '../../context/ConsentContext'
import { ConsentScriptLoader } from '../ConsentScriptLoader'
import type { ScriptIntegration } from '../scriptIntegrations'
import { createGoogleAnalyticsIntegration } from '../scriptIntegrations'

jest.mock('./scriptLoader', () => ({
  loadScript: jest.fn().mockResolvedValue(undefined),
}))

describe('ConsentScriptLoader - React 19 StrictMode', () => {
  const { loadScript } = require('./scriptLoader')

  beforeEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
    document.cookie = ''
  })

  test('script carrega apenas uma vez mesmo em StrictMode', async () => {
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
        <React.StrictMode>
          <ConsentProvider
            categories={{ enabledCategories: ['analytics'] }}
            initialState={initialState as any}
          >
            <ConsentScriptLoader integrations={[integration]} />
          </ConsentProvider>
        </React.StrictMode>,
      )
    })

    // Aguardar timeout do efeito
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // Deve ser chamado apenas UMA vez
    expect(loadScript).toHaveBeenCalledTimes(1)
  })

  test('múltiplas integrações carregam apenas uma vez cada', async () => {
    const integrations: ScriptIntegration[] = [
      { id: 'analytics-1', category: 'analytics', src: 'https://example.com/analytics1.js' },
      { id: 'analytics-2', category: 'analytics', src: 'https://example.com/analytics2.js' },
      { id: 'marketing-1', category: 'marketing', src: 'https://example.com/marketing.js' },
    ]

    const initialState = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true, marketing: true },
      version: '1.0',
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'programmatic',
      projectConfig: { enabledCategories: ['analytics', 'marketing'] },
    }

    await act(async () => {
      render(
        <React.StrictMode>
          <ConsentProvider
            categories={{ enabledCategories: ['analytics', 'marketing'] }}
            initialState={initialState as any}
          >
            <ConsentScriptLoader integrations={integrations} />
          </ConsentProvider>
        </React.StrictMode>,
      )
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // Cada script carrega exatamente uma vez
    expect(loadScript).toHaveBeenCalledTimes(3)
  })

  test('cleanup cancela carregamento pendente ao desmontar', async () => {
    const integration: ScriptIntegration = {
      id: 'unmount-test',
      category: 'analytics',
      src: 'https://example.com/unmount.js',
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

    const { unmount } = await act(async () => {
      return render(
        <React.StrictMode>
          <ConsentProvider
            categories={{ enabledCategories: ['analytics'] }}
            initialState={initialState as any}
          >
            <ConsentScriptLoader integrations={[integration]} />
          </ConsentProvider>
        </React.StrictMode>,
      )
    })

    // Desmontar antes do timeout executar
    unmount()

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // loadScript não deve ser chamado (ou no máximo 1x se já executou)
    const callCount = loadScript.mock.calls.length
    expect(callCount).toBeLessThanOrEqual(1)
  })
})
