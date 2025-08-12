/**
 * Integrações nativas com scripts de terceiros.
 * Facilita o carregamento automático baseado em consentimento.
 */

export interface ScriptIntegration {
  /** ID único da integração */
  id: string
  /** Categoria de consentimento necessária */
  category: string
  /** URL do script */
  src: string
  /** Função de inicialização após carregamento */
  init?: () => void
  /** Atributos adicionais do script */
  attrs?: Record<string, string>
}

/**
 * Configuração para Google Analytics 4.
 */
export interface GoogleAnalyticsConfig {
  measurementId: string
  config?: any
}

/**
 * Configuração para Google Tag Manager.
 */
export interface GoogleTagManagerConfig {
  containerId: string
  dataLayerName?: string
}

/**
 * Configuração para UserWay (acessibilidade).
 */
export interface UserWayConfig {
  accountId: string
}

/**
 * Cria integração para Google Analytics 4.
 */
export function createGoogleAnalyticsIntegration(
  config: GoogleAnalyticsConfig,
): ScriptIntegration {
  return {
    id: 'google-analytics',
    category: 'analytics',
    src: `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`,
    init: () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.dataLayer = window.dataLayer || []
        // @ts-ignore
        function gtag(...args: any[]) {
          // @ts-ignore
          window.dataLayer.push(arguments)
        }
        // @ts-ignore
        window.gtag = gtag
        // @ts-ignore
        gtag('js', new Date())
        // @ts-ignore
        gtag('config', config.measurementId, config.config || {})
      }
    },
    attrs: { async: 'true' },
  }
}

/**
 * Cria integração para Google Tag Manager.
 */
export function createGoogleTagManagerIntegration(
  config: GoogleTagManagerConfig,
): ScriptIntegration {
  return {
    id: 'google-tag-manager',
    category: 'analytics',
    src: `https://www.googletagmanager.com/gtm.js?id=${config.containerId}`,
    init: () => {
      if (typeof window !== 'undefined') {
        const dataLayerName = config.dataLayerName || 'dataLayer'
        // @ts-ignore
        window[dataLayerName] = window[dataLayerName] || []
        // @ts-ignore
        window[dataLayerName].push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js',
        })
      }
    },
  }
}

/**
 * Cria integração para UserWay (acessibilidade).
 */
export function createUserWayIntegration(
  config: UserWayConfig,
): ScriptIntegration {
  return {
    id: 'userway',
    category: 'marketing', // ou poderia ser uma categoria 'accessibility'
    src: `https://cdn.userway.org/widget.js`,
    init: () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.UserWayWidgetApp = window.UserWayWidgetApp || {}
        // @ts-ignore
        window.UserWayWidgetApp.accountId = config.accountId
      }
    },
    attrs: { 'data-account': config.accountId },
  }
}

/**
 * Integrações pré-configuradas mais comuns.
 */
export const COMMON_INTEGRATIONS = {
  googleAnalytics: createGoogleAnalyticsIntegration,
  googleTagManager: createGoogleTagManagerIntegration,
  userway: createUserWayIntegration,
}
