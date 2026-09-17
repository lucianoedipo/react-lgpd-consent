import { act, render, waitFor } from '@testing-library/react'
import * as React from 'react'
import { ConsentProvider } from '../../context/ConsentContext'
import { useConsent } from '../../hooks/useConsent'
import { __resetScriptRegistryForTests, useConsentScriptLoader } from '../ConsentScriptLoader'
import type { ScriptIntegration } from '../scriptIntegrations'
import { loadScript } from '../scriptLoader'
import type { Category, ConsentState } from '../../types/types'

jest.mock('../scriptLoader', () => ({ loadScript: jest.fn() }))
const load = jest.mocked(loadScript)

beforeEach(() => {
  __resetScriptRegistryForTests()
  load.mockReset().mockResolvedValue(undefined)
  document.cookie = 'cookieConsent=; max-age=0; path=/'
  document.cookie = 'lgpd-consent__v1=; max-age=0; path=/'
})

const initialState: ConsentState = {
  consented: true,
  isModalOpen: false,
  preferences: { necessary: true, analytics: true },
  version: '1.0',
  consentDate: new Date().toISOString(),
  lastUpdate: new Date().toISOString(),
  source: 'programmatic' as const,
  projectConfig: { enabledCategories: ['analytics'] as Category[] },
}

test('hook em StrictMode prepara uma vez e observa revogação sem nova chamada manual', async () => {
  const integration: ScriptIntegration = {
    id: 'manual',
    category: 'analytics',
    src: 'https://example.test/sdk.js',
    bootstrap: jest.fn(),
    beforeLoad: jest.fn(),
    init: jest.fn(),
    onConsentUpdate: jest.fn(),
  }
  let setPreference!: ReturnType<typeof useConsent>['setPreference']
  function Runner() {
    const run = useConsentScriptLoader()
    setPreference = useConsent().setPreference
    React.useEffect(() => {
      void run(integration)
    }, [run])
    return null
  }
  render(
    <React.StrictMode>
      <ConsentProvider
        categories={{ enabledCategories: ['analytics'] }}
        initialState={initialState}
      >
        <Runner />
      </ConsentProvider>
    </React.StrictMode>,
  )
  await waitFor(() => expect(integration.init).toHaveBeenCalledTimes(1))
  expect(integration.bootstrap).toHaveBeenCalledTimes(1)
  expect(integration.beforeLoad).toHaveBeenCalledTimes(1)
  expect(load).toHaveBeenCalledTimes(1)
  await act(async () => {
    setPreference('analytics', false)
  })
  expect(integration.onConsentUpdate).toHaveBeenLastCalledWith(
    expect.objectContaining({ preferences: expect.objectContaining({ analytics: false }) }),
  )
  await act(async () => {
    setPreference('analytics', true)
  })
  expect(integration.onConsentUpdate).toHaveBeenLastCalledWith(
    expect.objectContaining({ preferences: expect.objectContaining({ analytics: true }) }),
  )
  expect(integration.init).toHaveBeenCalledTimes(1)
})

test('hook consulta consentimento atual quando download termina após revogação', async () => {
  let finish!: () => void
  load.mockReturnValue(
    new Promise<void>((resolve) => {
      finish = resolve
    }),
  )
  const integration = {
    id: 'manual-race',
    category: 'analytics',
    src: 'sdk.js',
    init: jest.fn(),
    onConsentUpdate: jest.fn(),
  }
  let setPreference!: ReturnType<typeof useConsent>['setPreference']
  function Runner() {
    const run = useConsentScriptLoader()
    setPreference = useConsent().setPreference
    React.useEffect(() => {
      void run(integration)
    }, [run])
    return null
  }
  render(
    <ConsentProvider categories={{ enabledCategories: ['analytics'] }} initialState={initialState}>
      <Runner />
    </ConsentProvider>,
  )
  await waitFor(() => expect(load).toHaveBeenCalledTimes(1))
  await act(async () => {
    setPreference('analytics', false)
  })
  await act(async () => {
    finish()
  })
  expect(integration.init).not.toHaveBeenCalled()
  expect(integration.onConsentUpdate).toHaveBeenLastCalledWith(
    expect.objectContaining({ preferences: expect.objectContaining({ analytics: false }) }),
  )
})
