"use client"

import React from 'react'
import {
  ConsentProvider,
  ConsentScriptLoader,
} from '../../..' /* from library root when copied inside a Next app, import from 'react-lgpd-consent' */
import { COMMON_INTEGRATIONS } from '../../../src/utils/scriptIntegrations'
import { useConsent } from '../../../src/hooks/useConsent'

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
    if (typeof window === 'undefined') return
    const w = window as unknown as {
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
      // region: aplica a todas as regiões por padrão (ajuste conforme necessidade)
    })
  }, [])
  return null
}

// Sincroniza updates do consentimento com o Consent Mode v2 (gtag)
function GtagConsentUpdater() {
  const { consented, preferences } = useConsent()

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!consented) return
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (!w.gtag) return

    const update = toGtagConsentSignals(preferences as Record<string, boolean>)
    w.gtag('consent', 'update', update)
  }, [consented, preferences])

  return null
}

type Props = { children: React.ReactNode }

export default function ClientConsent({ children }: Props) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

  return (
    <ConsentProvider
      // Categories obrigatórias — ajuste conforme seu projeto
      categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}
      // Exibe overlay bloqueando interação até uma decisão
      blocking
      // Eventos de ciclo de vida: úteis para debug/telemetria
      onConsentGiven={(state) => {
        // Ex.: enviar um evento interno de onboarding de consentimento
        console.log('[consent] given', state.preferences)
      }}
      onPreferencesSaved={(prefs) => {
        console.log('[consent] updated', prefs)
      }}
    >
      {/* Define gtag stub e default consent negado para evitar data leaks */}
      <GtagConsentBootstrap />
      {/* Sincroniza mudanças de consentimento com Consent Mode v2 */}
      <GtagConsentUpdater />

      {/* Carrega GA4/GTM apenas quando há consentimento adequado */}
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

