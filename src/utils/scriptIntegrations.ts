import type { Category } from '../types/types'

export interface ScriptIntegration {
  id: string
  category: Category
  src: string
  init?: () => void
  attrs?: Record<string, string>
  cookies?: string[]
}

export interface GoogleAnalyticsConfig {
  measurementId: string
  config?: Record<string, unknown>
}

export interface GoogleTagManagerConfig {
  containerId: string
  dataLayerName?: string
}

export interface UserWayConfig {
  accountId: string
}

export function createGoogleAnalyticsIntegration(config: GoogleAnalyticsConfig): ScriptIntegration {
  return {
    id: 'google-analytics',
    category: 'analytics',
    src: `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`,
    cookies: ['_ga', '_ga_*', '_gid'],
    init: () => {
      if (typeof window !== 'undefined') {
        type Gtag = (...args: unknown[]) => void
        const w = window as Window & { dataLayer?: unknown[]; gtag?: Gtag }
        w.dataLayer = w.dataLayer ?? []
        const gtag: Gtag = (...args: unknown[]) => {
          w.dataLayer!.push(...args)
        }
        w.gtag = gtag
        gtag('js', new Date())
        gtag('config', config.measurementId, config.config ?? {})
      }
    },
    attrs: { async: 'true' },
  }
}

export function createGoogleTagManagerIntegration(
  config: GoogleTagManagerConfig,
): ScriptIntegration {
  return {
    id: 'google-tag-manager',
    category: 'analytics',
    src: `https://www.googletagmanager.com/gtm.js?id=${config.containerId}`,
    cookies: ['_gcl_au'],
    init: () => {
      if (typeof window !== 'undefined') {
        const dataLayerName = config.dataLayerName || 'dataLayer'
        const w = window as unknown as Record<string, unknown>
        const layer = (w[dataLayerName] as unknown[]) ?? []
        w[dataLayerName] = layer
        layer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
      }
    },
  }
}

export function createUserWayIntegration(config: UserWayConfig): ScriptIntegration {
  return {
    id: 'userway',
    category: 'functional',
    src: 'https://cdn.userway.org/widget.js',
    cookies: ['_userway_*'],
    init: () => {
      if (typeof window !== 'undefined') {
        const w = window as Window & { UserWayWidgetApp?: { accountId?: string } }
        w.UserWayWidgetApp = w.UserWayWidgetApp || {}
        w.UserWayWidgetApp.accountId = config.accountId
      }
    },
    attrs: { 'data-account': config.accountId },
  }
}

export const COMMON_INTEGRATIONS = {
  googleAnalytics: createGoogleAnalyticsIntegration,
  googleTagManager: createGoogleTagManagerIntegration,
  userway: createUserWayIntegration,
}

export interface FacebookPixelConfig {
  pixelId: string
  autoTrack?: boolean
  advancedMatching?: Record<string, unknown>
}

export interface HotjarConfig {
  siteId: string
  version?: number
  debug?: boolean
}

export interface MixpanelConfig {
  token: string
  config?: Record<string, unknown>
  api_host?: string
}

export interface ClarityConfig {
  projectId: string
  upload?: boolean
}

export interface IntercomConfig {
  app_id: string
}

export interface ZendeskConfig {
  key: string
}

export function createFacebookPixelIntegration(config: FacebookPixelConfig): ScriptIntegration {
  return {
    id: 'facebook-pixel',
    category: 'marketing',
    src: 'https://connect.facebook.net/en_US/fbevents.js',
    cookies: ['_fbp', 'fr'],
    init: () => {
      if (typeof window !== 'undefined') {
        type FbqFn = ((...args: unknown[]) => void) & {
          queue?: unknown[]
          loaded?: boolean
          callMethod?: (...args: unknown[]) => void
        }
        const w = window as unknown as { fbq?: FbqFn }
        if (!w.fbq) {
          const fbq: FbqFn = ((...args: unknown[]) => {
            if (w.fbq && typeof w.fbq.callMethod === 'function') {
              w.fbq.callMethod(...args)
            } else {
              fbq.queue = fbq.queue || []
              fbq.queue.push(args)
            }
          })
          fbq.loaded = true
          w.fbq = fbq
        }
        w.fbq('init', config.pixelId, config.advancedMatching ?? {})
        if (config.autoTrack !== false) w.fbq('track', 'PageView')
      }
    },
  }
}

export function createHotjarIntegration(config: HotjarConfig): ScriptIntegration {
  const v = config.version ?? 6
  return {
    id: 'hotjar',
    category: 'analytics',
    src: `https://static.hotjar.com/c/hotjar-${config.siteId}.js?sv=${v}`,
    cookies: ['_hjSession_*', '_hjSessionUser_*', '_hjFirstSeen', '_hjIncludedInSessionSample', '_hjAbsoluteSessionInProgress'],
    init: () => {
      if (typeof window !== 'undefined') {
        type HjFn = ((...args: unknown[]) => void) & { q?: unknown[] }
        const w = window as unknown as { hj?: HjFn; _hjSettings?: { hjid: string; hjsv: number } }
        w._hjSettings = { hjid: config.siteId, hjsv: v }
        if (!w.hj) {
          const hj: HjFn = ((...args: unknown[]) => {
            hj.q = hj.q || []
            hj.q.push(args)
          })
          w.hj = hj
        }
        if (config.debug && typeof console !== 'undefined' && typeof console.info === 'function') {
          console.info('[Hotjar] initialized with siteId', config.siteId)
        }
      }
    },
  }
}

export function createMixpanelIntegration(config: MixpanelConfig): ScriptIntegration {
  return {
    id: 'mixpanel',
    category: 'analytics',
    src: 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
    cookies: ['mp_*'],
    init: () => {
      if (typeof window !== 'undefined') {
        const w = window as unknown as { mixpanel?: { init?: (...a: unknown[]) => void } }
        w.mixpanel = w.mixpanel || { init: () => undefined }
        if (w.mixpanel && typeof w.mixpanel.init === 'function') {
          try {
            w.mixpanel.init(config.token, config.config ?? {}, config.api_host)
          } catch (error) {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
              console.warn('[Mixpanel] Failed to initialize:', error)
            }
          }
        }
      }
    },
  }
}

export function createClarityIntegration(config: ClarityConfig): ScriptIntegration {
  return {
    id: 'clarity',
    category: 'analytics',
    src: `https://www.clarity.ms/tag/${config.projectId}`,
    cookies: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'],
    init: () => {
      if (typeof window !== 'undefined' && typeof config.upload !== 'undefined') {
        const w = window as unknown as { clarity?: (...args: unknown[]) => void }
        if (typeof w.clarity === 'function') {
          try {
            w.clarity('set', 'upload', config.upload)
          } catch (error) {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
              console.warn('[Clarity] Failed to configure upload setting:', error)
            }
          }
        }
      }
    },
  }
}

export function createIntercomIntegration(config: IntercomConfig): ScriptIntegration {
  return {
    id: 'intercom',
    category: 'functional',
    src: `https://widget.intercom.io/widget/${config.app_id}`,
    cookies: ['intercom-id-*', 'intercom-session-*'],
    init: () => {
      if (typeof window !== 'undefined') {
        const w = window as unknown as { Intercom?: (...args: unknown[]) => void }
        if (typeof w.Intercom === 'function') {
          try {
            w.Intercom('boot', { app_id: config.app_id })
          } catch (error) {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
              console.warn('[Intercom] Failed to boot:', error)
            }
          }
        }
      }
    },
  }
}

export function createZendeskChatIntegration(config: ZendeskConfig): ScriptIntegration {
  return {
    id: 'zendesk-chat',
    category: 'functional',
    src: `https://static.zdassets.com/ekr/snippet.js?key=${config.key}`,
    cookies: ['__zlcmid', '_zendesk_shared_session'],
    init: () => {
      if (typeof window !== 'undefined') {
        const w = window as unknown as { zE?: (...args: unknown[]) => void }
        if (typeof w.zE === 'function') {
          try {
            w.zE('webWidget', 'identify', { key: config.key })
          } catch (error) {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
              console.warn('[Zendesk] Failed to identify:', error)
            }
          }
        }
      }
    },
  }
}

export interface ECommerceConfig {
  googleAnalytics?: GoogleAnalyticsConfig
  facebookPixel?: FacebookPixelConfig
  hotjar?: HotjarConfig
  userway?: UserWayConfig
}

export interface SaaSConfig {
  googleAnalytics?: GoogleAnalyticsConfig
  mixpanel?: MixpanelConfig
  intercom?: IntercomConfig
  hotjar?: HotjarConfig
}

export interface CorporateConfig {
  googleAnalytics?: GoogleAnalyticsConfig
  clarity?: ClarityConfig
  zendesk?: ZendeskConfig
  userway?: UserWayConfig
}

export function createECommerceIntegrations(cfg: ECommerceConfig): ScriptIntegration[] {
  const list: ScriptIntegration[] = []
  if (cfg.googleAnalytics) list.push(createGoogleAnalyticsIntegration(cfg.googleAnalytics))
  if (cfg.facebookPixel) list.push(createFacebookPixelIntegration(cfg.facebookPixel))
  if (cfg.hotjar) list.push(createHotjarIntegration(cfg.hotjar))
  if (cfg.userway) list.push(createUserWayIntegration(cfg.userway))
  return list
}

export function createSaaSIntegrations(cfg: SaaSConfig): ScriptIntegration[] {
  const list: ScriptIntegration[] = []
  if (cfg.googleAnalytics) list.push(createGoogleAnalyticsIntegration(cfg.googleAnalytics))
  if (cfg.mixpanel) list.push(createMixpanelIntegration(cfg.mixpanel))
  if (cfg.intercom) list.push(createIntercomIntegration(cfg.intercom))
  if (cfg.hotjar) list.push(createHotjarIntegration(cfg.hotjar))
  return list
}

export function createCorporateIntegrations(cfg: CorporateConfig): ScriptIntegration[] {
  const list: ScriptIntegration[] = []
  if (cfg.googleAnalytics) list.push(createGoogleAnalyticsIntegration(cfg.googleAnalytics))
  if (cfg.clarity) list.push(createClarityIntegration(cfg.clarity))
  if (cfg.zendesk) list.push(createZendeskChatIntegration(cfg.zendesk))
  if (cfg.userway) list.push(createUserWayIntegration(cfg.userway))
  return list
}

export const INTEGRATION_TEMPLATES = {
  ecommerce: {
    essential: ['google-analytics', 'facebook-pixel'],
    optional: ['hotjar', 'userway'],
    categories: ['analytics', 'marketing', 'functional'] as Category[],
  },
  saas: {
    essential: ['google-analytics', 'mixpanel'],
    optional: ['intercom', 'hotjar'],
    categories: ['analytics', 'functional'] as Category[],
  },
  corporate: {
    essential: ['google-analytics'],
    optional: ['userway', 'zendesk-chat', 'clarity'],
    categories: ['analytics', 'functional'] as Category[],
  },
}

export function suggestCategoryForScript(name: string): Category[] {
  const n = name.toLowerCase()
  if (n.includes('facebook') || n.includes('pixel') || n.includes('ads')) return ['marketing']
  if (n.includes('hotjar') || n.includes('mixpanel') || n.includes('clarity')) return ['analytics']
  if (n.includes('intercom') || n.includes('zendesk') || n.includes('chat')) return ['functional']
  return ['analytics']
}
