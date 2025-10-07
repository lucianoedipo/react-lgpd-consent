import React from 'react'
import {
  ConsentProvider,
  ConsentScriptLoader,
} from '../../..' /* in-app: import from 'react-lgpd-consent' */
import { COMMON_INTEGRATIONS } from '../../../src/utils/scriptIntegrations'
import { GtagConsentBootstrap, GtagConsentUpdater } from './consent/GtagConsent'

const GA_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX'
const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXX'

export default function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
      blocking
      onConsentGiven={(state) => console.log('[consent] given', state.preferences)}
      onPreferencesSaved={(prefs) => console.log('[consent] updated', prefs)}
    >
      <GtagConsentBootstrap />
      <GtagConsentUpdater />

      <ConsentScriptLoader
        integrations={[
          COMMON_INTEGRATIONS.googleAnalytics({ measurementId: GA_ID }),
          COMMON_INTEGRATIONS.googleTagManager({ containerId: GTM_ID }),
        ]}
      />

      <main style={{ padding: 24 }}>
        <h1>Vite + LGPD Consent</h1>
        <p>
          Este exemplo demonstra Consent Mode v2 e bloqueio de scripts (GTM/GA4) até o
          consentimento.
        </p>
      </main>
    </ConsentProvider>
  )
}

