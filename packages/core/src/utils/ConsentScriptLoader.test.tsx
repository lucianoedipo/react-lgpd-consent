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

    const { loadScript } = require('./scriptLoader')
    expect(loadScript).toHaveBeenCalled()
  })
})
