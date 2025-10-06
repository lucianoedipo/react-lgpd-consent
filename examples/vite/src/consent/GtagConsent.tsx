import React from 'react'
import { useConsent } from '../../../src/hooks/useConsent' /* in-app: import from 'react-lgpd-consent' */

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

export function GtagConsentBootstrap() {
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

    // default consent negado: impede uso de storage/ads/analytics antes da decisão
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    })
  }, [])
  return null
}

export function GtagConsentUpdater() {
  const { consented, preferences } = useConsent()
  React.useEffect(() => {
    if (!consented || typeof window === 'undefined') return
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (!w.gtag) return
    w.gtag('consent', 'update', toGtagConsentSignals(preferences as Record<string, boolean>))
  }, [consented, preferences])
  return null
}

