/**
 * @interface ScriptIntegration
 * Define a estrutura de um objeto de integração de script, usado para carregar scripts de terceiros condicionalmente.
 */
export interface ScriptIntegration {
  /** Um ID único para esta integração de script. */
  id: string
  /** A categoria de consentimento necessária para que este script seja carregado (ex: 'analytics', 'marketing'). */
  category: string
  /** A URL do script a ser carregado. */
  src: string
  /** Uma função opcional a ser executada após o script ser carregado e inicializado no DOM. */
  init?: () => void
  /** Um objeto de atributos HTML a serem adicionados à tag `<script>` (ex: `{ async: 'true' }`). */
  attrs?: Record<string, string>
}

/**
 * @interface GoogleAnalyticsConfig
 * Configuração específica para a integração com o Google Analytics 4 (GA4).
 */
export interface GoogleAnalyticsConfig {
  /** O ID de medição do GA4 (ex: 'G-XXXXXXXXXX'). */
  measurementId: string
  /** Um objeto opcional de configuração adicional a ser passado para o comando `gtag('config')`. */
  config?: any
}

/**
 * @interface GoogleTagManagerConfig
 * Configuração específica para a integração com o Google Tag Manager (GTM).
 */
export interface GoogleTagManagerConfig {
  /** O ID do contêiner do GTM (ex: 'GTM-XXXXXXX'). */
  containerId: string
  /** O nome da camada de dados (dataLayer) a ser usada. Padrão: 'dataLayer'. */
  dataLayerName?: string
}

/**
 * @interface UserWayConfig
 * Configuração específica para a integração com o widget de acessibilidade UserWay.
 */
export interface UserWayConfig {
  /** O ID da conta UserWay. */
  accountId: string
}

/**
 * @function
 * Cria um objeto de integração para o Google Analytics 4 (GA4).
 *
 * @param {GoogleAnalyticsConfig} config A configuração do GA4, incluindo o `measurementId`.
 * @returns {ScriptIntegration} Um objeto `ScriptIntegration` configurado para o GA4.
 */
export function createGoogleAnalyticsIntegration(config: GoogleAnalyticsConfig): ScriptIntegration {
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
          window.dataLayer.push(...args)
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
 * @function
 * Cria um objeto de integração para o Google Tag Manager (GTM).
 *
 * @param {GoogleTagManagerConfig} config A configuração do GTM, incluindo o `containerId`.
 * @returns {ScriptIntegration} Um objeto `ScriptIntegration` configurado para o GTM.
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
 * @function
 * Cria um objeto de integração para o widget de acessibilidade UserWay.
 *
 * @param {UserWayConfig} config A configuração do UserWay, incluindo o `accountId`.
 * @returns {ScriptIntegration} Um objeto `ScriptIntegration` configurado para o UserWay.
 */
export function createUserWayIntegration(config: UserWayConfig): ScriptIntegration {
  return {
    id: 'userway',
    category: 'functional',
    src: 'https://cdn.userway.org/widget.js',
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
 * @constant
 * Objeto contendo as factory functions para as integrações pré-configuradas mais comuns.
 *
 * @example
 * ```tsx
 * import { COMMON_INTEGRATIONS } from 'react-lgpd-consent';
 * const gaIntegration = COMMON_INTEGRATIONS.googleAnalytics({ measurementId: 'G-XYZ' });
 * ```
 */
export const COMMON_INTEGRATIONS = {
  googleAnalytics: createGoogleAnalyticsIntegration,
  googleTagManager: createGoogleTagManagerIntegration,
  userway: createUserWayIntegration,
}
