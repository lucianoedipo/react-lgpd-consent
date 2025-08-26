import * as React from 'react'
import { render, act } from '@testing-library/react'
import { ConsentScriptLoader } from './ConsentScriptLoader'
import { ConsentProvider } from '../context/ConsentContext'

jest.mock('./scriptLoader', () => ({
  loadScript: jest.fn().mockResolvedValue(undefined),
}))

import { createGoogleAnalyticsIntegration } from './scriptIntegrations'

describe('ConsentScriptLoader component', () => {
  // Suprimir logs do developerGuidance durante estes testes
  let __logSpy: jest.SpyInstance,
    __infoSpy: jest.SpyInstance,
    __groupSpy: jest.SpyInstance,
    __warnSpy: jest.SpyInstance,
    __errorSpy: jest.SpyInstance

  beforeAll(() => {
    __logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    __infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    __groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
    __warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    __errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    __logSpy.mockRestore()
    __infoSpy.mockRestore()
    __groupSpy.mockRestore()
    __warnSpy.mockRestore()
    __errorSpy.mockRestore()
  })

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

    const { loadScript } = require('./scriptLoader')
    expect(loadScript).toHaveBeenCalled()
  })
})
