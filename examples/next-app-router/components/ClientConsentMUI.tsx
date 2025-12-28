'use client'

import { COMMON_INTEGRATIONS } from '@react-lgpd-consent/core'
import { ConsentProvider, ConsentScriptLoader, useConsent } from '@react-lgpd-consent/mui'
import React from 'react'

// Mapeia categorias -> sinais do Consent Mode v2
function toGtagConsentSignals(prefs: Record<string, boolean>) {
  const analytics = prefs.analytics === true
  const marketing = prefs.marketing === true
  return {
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
    analytics_storage: analytics ? 'granted' : 'denied',
  }
}

// Prepara dataLayer/gtag stub e define consentimento padrão negado (default consent)
function GtagConsentBootstrap() {
  React.useEffect(() => {
    const currentWindow = globalThis.window
    if (currentWindow === undefined) return
    const w = currentWindow as unknown as {
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
    }
    w.dataLayer = w.dataLayer ?? []
    const gtag = (...args: unknown[]) => {
      w.dataLayer!.push(args)
    }
    w.gtag = gtag

    // Define consentimento padrão como negado para todos os sinais
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    })
  }, [])
  return null
}

// Sincroniza updates do consentimento com o Consent Mode v2 (gtag)
function GtagConsentUpdater() {
  const { consented, preferences } = useConsent()

  React.useEffect(() => {
    const currentWindow = globalThis.window
    if (currentWindow === undefined) return
    if (!consented) return
    const w = currentWindow as unknown as { gtag?: (...args: unknown[]) => void }
    if (!w.gtag) return

    const update = toGtagConsentSignals(preferences as Record<string, boolean>)
    w.gtag('consent', 'update', update)
  }, [consented, preferences])

  return null
}

type Props = { children: React.ReactNode }

export default function ClientConsentMUI({ children }: Props) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
      blocking
      onConsentGiven={(state) => {
        console.log('[consent] given', state.preferences)
      }}
      onPreferencesSaved={(prefs) => {
        console.log('[consent] updated', prefs)
      }}
    >
      {/* O PreferencesModal é injetado automaticamente pelo ConsentProvider do MUI! */}

      <GtagConsentBootstrap />
      <GtagConsentUpdater />

      <ConsentScriptLoader
        integrations={[
          COMMON_INTEGRATIONS.googleAnalytics({ measurementId: GA_ID }),
          COMMON_INTEGRATIONS.googleTagManager({ containerId: GTM_ID }),
        ]}
      />

      {children}
    </ConsentProvider>
  )
}
