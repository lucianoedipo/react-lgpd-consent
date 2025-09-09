/**
 * @interface ScriptIntegration
 * Estrutura de uma integração de script de terceiros a ser carregada condicionalmente conforme o consentimento.
 *
 * @remarks
 * - `category` é um `Category` tipado (ex.: 'analytics', 'marketing').
 * - `init` roda após o script ser inserido no DOM e carregado.
 * - `attrs` é repassado como atributos HTML da tag `<script>`.
 */
import type { Category } from '../types/types'

export interface ScriptIntegration {
  /** Um ID único para esta integração de script. */
  id: string
  /** Categoria de consentimento necessária para carregar o script. */
  category: Category
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
  /** Objeto opcional repassado para `gtag('config')`. */
  config?: Record<string, unknown>
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
 * @category Utils
 * @since 0.2.0
 * Cria uma integração para Google Analytics 4 (GA4).
 *
 * @param {GoogleAnalyticsConfig} config Configuração com `measurementId` e `config` opcional.
 * @returns {ScriptIntegration} Integração tipada com `category: 'analytics'`.
 */
export function createGoogleAnalyticsIntegration(config: GoogleAnalyticsConfig): ScriptIntegration {
  return {
    id: 'google-analytics',
    category: 'analytics',
    src: `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`,
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

/**
 * @function
 * @category Utils
 * @since 0.2.0
 * Cria uma integração para Google Tag Manager (GTM).
 *
 * @param {GoogleTagManagerConfig} config Configuração com `containerId` e `dataLayerName` opcional.
 * @returns {ScriptIntegration} Integração tipada com `category: 'analytics'`.
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
        const w = window as unknown as Record<string, unknown>
        const layer = (w[dataLayerName] as unknown[]) ?? []
        w[dataLayerName] = layer
        layer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js',
        })
      }
    },
  }
}

/**
 * @function
 * @category Utils
 * @since 0.2.0
 * Cria uma integração para o widget de acessibilidade UserWay.
 *
 * @param {UserWayConfig} config Configuração com `accountId`.
 * @returns {ScriptIntegration} Integração tipada com `category: 'functional'`.
 */
export function createUserWayIntegration(config: UserWayConfig): ScriptIntegration {
  return {
    id: 'userway',
    category: 'functional',
    src: 'https://cdn.userway.org/widget.js',
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

/**
 * @constant
 * @category Utils
 * @since 0.2.0
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
