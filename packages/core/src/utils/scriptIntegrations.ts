/**
 * @fileoverview
 * Integrações nativas de scripts (GA, GTM, Facebook Pixel, Hotjar, Mixpanel, Clarity, Intercom, Zendesk, UserWay)
 * com categorias LGPD padrão, cookies típicos e pontos de extensão para URLs.
 *
 * Princípios:
 * - Cada integração define uma categoria padrão (mais aderente ao uso no mercado)
 * - Cada cookie típico aparece em uma única categoria por padrão
 * - URLs possuem valores default atualizados e podem ser sobrescritos via `scriptUrl`
 * - SSR-safe: toda execução que toca `window` é protegida
 */
// Removed import of Category as it's no longer used - ScriptIntegration now uses string
import type { ConsentPreferences } from '../types/types'
import { logger } from './logger'

/**
 * Integração de script de terceiros condicionada a consentimento.
 *
 * @category Utils
 * @since 0.2.0
 *
 * @remarks
 * **Breaking Change em v0.4.1**: O campo `category` mudou de `Category` para `string`
 * para suportar categorias customizadas. Código existente usando strings literais
 * continua funcionando sem alterações.
 *
 * @example
 * ```typescript
 * const integration: ScriptIntegration = {
 *   id: 'my-script',
 *   category: 'analytics',
 *   src: 'https://example.com/script.js',
 *   cookies: ['_example'],
 *   init: () => console.log('Script initialized')
 * }
 * ```
 */
export type IntegrationConsent = { consented: boolean; preferences: ConsentPreferences }

/** @category Types */
export interface GoogleConsentConfig {
  /** Categoria para analytics_storage. Padrão: categoria da integração. */
  analyticsStorageCategory?: string
  /** Categoria para os sinais de publicidade. Padrão: marketing. */
  adStorageCategory?: string
}

export interface ScriptIntegration {
  /** Identificador único da integração */
  id: string
  /**
   * Categoria LGPD à qual o script pertence.
   * Suporta tanto categorias predefinidas quanto customizadas.
   */
  category: string
  /** Nome legível da integração (opcional) */
  name?: string
  /** URL do script a ser carregado */
  src: string
  /** Se o script deve ser carregado de forma assíncrona */
  async?: boolean
  /** Se o script deve ser deferido */
  defer?: boolean
  /** Configuração específica da integração */
  config?: Record<string, unknown>
  /** Função de inicialização executada após carregamento do script */
  init?: () => void
  /** Preparação local após autorização, antes de inserir o script externo. */
  beforeLoad?: (consent: IntegrationConsent) => void
  /** Atributos HTML adicionais para a tag script */
  attrs?: Record<string, string>
  /** Nonce CSP opcional aplicado à tag script */
  nonce?: string
  /** Prioridade para ordenação na fila do loader (maior = executa primeiro dentro da categoria) */
  priority?: number
  /** Rotina opcional executada antes do carregamento principal (ex.: bootstrap de Consent Mode) */
  bootstrap?: () => void | Promise<void>
  /** Callback disparado quando o consentimento é atualizado */
  onConsentUpdate?: (consent: { consented: boolean; preferences: ConsentPreferences }) => void
  /** Lista de cookies que o script pode definir */
  cookies?: string[]
  /** Informações detalhadas dos cookies (nome, finalidade, duração, fornecedor) */
  cookiesInfo?: Array<{
    name: string
    purpose: string
    duration: string
    provider: string
  }>
}

/**
 * Configuração para integrações customizadas com categoria sugerida automaticamente.
 *
 * @category Utils
 * @since 0.7.2
 */
export interface SuggestedIntegrationConfig extends Omit<ScriptIntegration, 'category'> {
  /** Categoria LGPD customizada (opcional). Se omitida, usa sugestão automática. */
  category?: string
}

/**
 * Cria integração customizada aplicando categoria sugerida automaticamente.
 * Permite sobrescrever a categoria quando necessário.
 *
 * @category Utils
 * @since 0.7.2
 *
 * @example
 * ```typescript
 * const custom = createSuggestedIntegration({
 *   id: 'custom-chat',
 *   src: 'https://example.com/chat.js'
 * })
 * // -> category sugerida: 'functional'
 * ```
 */
export function createSuggestedIntegration(config: SuggestedIntegrationConfig): ScriptIntegration {
  const suggested = suggestCategoryForScript(config.id)[0] ?? 'analytics'
  const category = resolveCategory(suggested, config.category)
  const { category: _ignored, ...rest } = config
  return { ...rest, category }
}

const resolveCategory = (fallback: string, override?: string) => {
  if (typeof override === 'string' && override.trim().length > 0) return override.trim()
  return fallback
}

const isDevEnv = () => {
  const env =
    typeof globalThis !== 'undefined'
      ? (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV
      : undefined
  return env !== 'production'
}

const resolveRequiredString = (value: string, field: string, integrationId: string) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    if (isDevEnv()) {
      console.error(
        `[LGPD-CONSENT] Config inválida: integração "${integrationId}" requer "${field}".`,
      )
    }
    return null
  }
  return value.trim()
}

function buildConsentModeSignals(
  preferences: ConsentPreferences,
  config: GoogleConsentConfig = {},
) {
  const analytics = preferences[config.analyticsStorageCategory ?? 'analytics']
    ? 'granted'
    : 'denied'
  const marketing = preferences[config.adStorageCategory ?? 'marketing'] ? 'granted' : 'denied'
  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
  }
}

function ensureGtag(dataLayerName = 'dataLayer') {
  if (globalThis.window === undefined) return null
  const w = window as unknown as Record<string, unknown>
  const layer = (w[dataLayerName] ??= []) as unknown[]
  // O snippet oficial usa Arguments, não Array. Layers customizados não reutilizam window.gtag.
  const send = function (..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params -- snippet oficial usa Arguments, não Array
    layer.push(arguments)
  }
  if (dataLayerName !== 'dataLayer') return send
  if (typeof w.gtag !== 'function') w.gtag = send
  return w.gtag as (...args: unknown[]) => void
}

function applyDefaultConsentMode(dataLayerName?: string) {
  ensureGtag(dataLayerName)?.('consent', 'default', buildConsentModeSignals({ necessary: true }))
}

function applyConsentModeUpdate(
  consent: IntegrationConsent,
  config: GoogleConsentConfig,
  dataLayerName?: string,
) {
  ensureGtag(dataLayerName)?.(
    'consent',
    'update',
    buildConsentModeSignals(consent.consented ? consent.preferences : { necessary: true }, config),
  )
}

/**
 * Configuração para integração do Google Analytics (GA4).
 *
 * @category Utils
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const config: GoogleAnalyticsConfig = {
 *   measurementId: 'G-XXXXXXXXXX',
 *   config: { send_page_view: false }
 * }
 * ```
 */
export interface GoogleAnalyticsConfig extends GoogleConsentConfig {
  /** ID de medição do GA4 (formato: G-XXXXXXXXXX) */
  measurementId: string
  /** Configurações adicionais para o gtag */
  config?: Record<string, unknown>
  /** URL do script GA4. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Configuração para integração do Google Tag Manager (GTM).
 *
 * @category Utils
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const config: GoogleTagManagerConfig = {
 *   containerId: 'GTM-XXXXXXX',
 *   dataLayerName: 'customDataLayer'
 * }
 * ```
 */
export interface GoogleTagManagerConfig extends GoogleConsentConfig {
  /** ID do container GTM (formato: GTM-XXXXXXX) */
  containerId: string
  /** Nome customizado para o dataLayer. Padrão: 'dataLayer' */
  dataLayerName?: string
  /** URL do script GTM. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Configuração para integração do UserWay (Acessibilidade).
 *
 * @category Utils
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const config: UserWayConfig = {
 *   accountId: 'XXXXXXXXXX'
 * }
 * ```
 */
export interface UserWayConfig {
  /** ID da conta UserWay */
  accountId: string
  /** URL do script UserWay. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Cria integração do Google Analytics (GA4).
 * Configura o gtag e inicializa o tracking com o measurement ID fornecido.
 *
 * @category Utils
 * @param config - Configuração do Google Analytics
 * @returns Integração configurada para o GA4
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const ga = createGoogleAnalyticsIntegration({
 *   measurementId: 'G-XXXXXXXXXX',
 *   config: { send_page_view: false }
 * })
 * ```
 *
 * @remarks
 * - Define cookies: _ga, _ga_*
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createGoogleAnalyticsIntegration(config: GoogleAnalyticsConfig): ScriptIntegration {
  const category = resolveCategory('analytics', config.category)
  const measurementId = resolveRequiredString(
    config.measurementId,
    'measurementId',
    'google-analytics',
  )
  if (!measurementId) {
    return {
      id: 'google-analytics',
      category,
      src: '',
      cookies: ['_ga', '_ga_*'],
      cookiesInfo: [
        {
          name: '_ga',
          purpose: 'Identificação única de visitantes para análise de tráfego',
          duration: '2 anos',
          provider: 'Google Analytics',
        },
        {
          name: '_ga_*',
          purpose: 'Rastreamento de sessões e eventos específicos do stream GA4',
          duration: '2 anos',
          provider: 'Google Analytics',
        },
      ],
      attrs: { async: 'true' },
    }
  }
  const src = config.scriptUrl ?? `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  return {
    id: 'google-analytics',
    category,
    src,
    cookies: ['_ga', '_ga_*'],
    cookiesInfo: [
      {
        name: '_ga',
        purpose: 'Identificação única de visitantes para análise de tráfego',
        duration: '2 anos',
        provider: 'Google Analytics',
      },
      {
        name: '_ga_*',
        purpose: 'Rastreamento de sessões e eventos específicos do stream GA4',
        duration: '2 anos',
        provider: 'Google Analytics',
      },
    ],
    bootstrap: () => {
      applyDefaultConsentMode()
    },
    beforeLoad: (consent) =>
      applyConsentModeUpdate(consent, {
        ...config,
        analyticsStorageCategory: config.analyticsStorageCategory ?? category,
      }),
    onConsentUpdate: (consent) =>
      applyConsentModeUpdate(consent, {
        ...config,
        analyticsStorageCategory: config.analyticsStorageCategory ?? category,
      }),
    init: () => {
      const gtag = ensureGtag()
      if (!gtag) return
      gtag('js', new Date())
      gtag('config', measurementId, config.config ?? {})
    },
    attrs: { async: 'true' },
  }
}

/**
 * Cria integração do Google Tag Manager (GTM).
 * Configura o dataLayer e inicializa o container GTM.
 *
 * @category Utils
 * @param config - Configuração do Google Tag Manager
 * @returns Integração configurada para o GTM
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const gtm = createGoogleTagManagerIntegration({
 *   containerId: 'GTM-XXXXXXX',
 *   dataLayerName: 'myDataLayer'
 * })
 * ```
 *
 * @remarks
 * - O container não define cookies próprios; declare os cookies das tags configuradas.
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createGoogleTagManagerIntegration(
  config: GoogleTagManagerConfig,
): ScriptIntegration {
  const category = resolveCategory('analytics', config.category)
  const containerId = resolveRequiredString(config.containerId, 'containerId', 'google-tag-manager')
  if (!containerId) {
    return {
      id: 'google-tag-manager',
      category,
      src: '',
      cookies: [],
    }
  }
  const dataLayerName = config.dataLayerName || 'dataLayer'
  const dataLayerParam =
    dataLayerName === 'dataLayer' ? '' : `&l=${encodeURIComponent(dataLayerName)}`
  const src =
    config.scriptUrl ?? `https://www.googletagmanager.com/gtm.js?id=${containerId}${dataLayerParam}`
  return {
    id: 'google-tag-manager',
    category,
    src,
    cookies: [],
    bootstrap: () => {
      applyDefaultConsentMode(config.dataLayerName)
    },
    onConsentUpdate: (consent) =>
      applyConsentModeUpdate(
        consent,
        { ...config, analyticsStorageCategory: config.analyticsStorageCategory ?? category },
        dataLayerName,
      ),
    beforeLoad: (consent) => {
      applyConsentModeUpdate(
        consent,
        { ...config, analyticsStorageCategory: config.analyticsStorageCategory ?? category },
        dataLayerName,
      )
      const currentWindow = globalThis.window
      if (currentWindow !== undefined) {
        const w = currentWindow as unknown as Record<string, unknown>
        const layer = (w[dataLayerName] as unknown[]) ?? []
        w[dataLayerName] = layer
        layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      }
    },
  }
}

/**
 * Cria integração do UserWay (Acessibilidade).
 * Configura o widget de acessibilidade UserWay.
 *
 * @category Utils
 * @param config - Configuração do UserWay
 * @returns Integração configurada para o UserWay
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const userway = createUserWayIntegration({
 *   accountId: 'XXXXXXXXXX'
 * })
 * ```
 *
 * @remarks
 * - Define cookies: _userway_*
 * - Categoria padrão: 'functional'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createUserWayIntegration(config: UserWayConfig): ScriptIntegration {
  const category = resolveCategory('functional', config.category)
  const accountId = resolveRequiredString(config.accountId, 'accountId', 'userway')
  if (!accountId) {
    return {
      id: 'userway',
      category,
      src: '',
      cookies: ['_userway_*'],
    }
  }
  const src = config.scriptUrl ?? 'https://cdn.userway.org/widget.js'
  return {
    id: 'userway',
    category,
    src,
    cookies: ['_userway_*'],
    init: () => {
      const currentWindow = globalThis.window
      if (currentWindow !== undefined) {
        const w = currentWindow as Window & { UserWayWidgetApp?: { accountId?: string } }
        w.UserWayWidgetApp = w.UserWayWidgetApp || {}
        w.UserWayWidgetApp.accountId = accountId
      }
    },
    attrs: { 'data-account': accountId },
  }
}

/**
 * Funções fábricas para integrações comuns.
 * Fornece acesso direto às funções de criação de integrações pré-configuradas.
 *
 * @category Utils
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const ga = COMMON_INTEGRATIONS.googleAnalytics({ measurementId: 'G-XXXXXXXXXX' })
 * ```
 */
export const COMMON_INTEGRATIONS = {
  googleAnalytics: createGoogleAnalyticsIntegration,
  googleTagManager: createGoogleTagManagerIntegration,
  userway: createUserWayIntegration,
}

/**
 * Configuração para integração do Facebook Pixel.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: FacebookPixelConfig = {
 *   pixelId: '1234567890123456',
 *   autoTrack: true,
 *   advancedMatching: { email: 'user@example.com' }
 * }
 * ```
 */
export interface FacebookPixelConfig {
  /** ID do pixel do Facebook */
  pixelId: string
  /** Se deve rastrear PageView automaticamente. Padrão: true */
  autoTrack?: boolean
  /** Configuração de correspondência avançada */
  advancedMatching?: Record<string, unknown>
  /** URL do script do Pixel. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Configuração para integração do Hotjar.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: HotjarConfig = {
 *   siteId: '1234567',
 *   version: 6,
 *   debug: false
 * }
 * ```
 */
export interface HotjarConfig {
  /** Após revogação, encerra a sessão recarregando a página. Pode ser substituído pelo host. */
  onRevoke?: () => void
  /** ID do site no Hotjar */
  siteId: string
  /** Versão do script Hotjar. Padrão: 6 */
  version?: number
  /** Ativar modo debug. Padrão: false */
  debug?: boolean
  /** URL do script Hotjar. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Configuração para integração do Mixpanel.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: MixpanelConfig = {
 *   token: 'your-project-token',
 *   config: { debug: true },
 *   api_host: 'https://api.mixpanel.com'
 * }
 * ```
 */
export interface MixpanelConfig {
  /** Token do projeto Mixpanel */
  token: string
  /** Configurações adicionais do Mixpanel */
  config?: Record<string, unknown>
  /** Host customizado da API Mixpanel */
  api_host?: string
  /** URL do script Mixpanel. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

type ConsentStorageValue = 'granted' | 'denied'

/**
 * Configuração para integração do Microsoft Clarity.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: ClarityConfig = {
 *   projectId: 'abcdefghij',
 *   consentMode: true
 * }
 * ```
 */
export interface ClarityConfig {
  /** ID do projeto no Microsoft Clarity */
  projectId: string
  /** Configuração de upload de dados. Padrão: indefinido */
  /**
   * @deprecated A Microsoft recomenda Consent API v2. A integração agora envia
   * `clarity('consentv2', ...)` automaticamente em `onConsentUpdate`.
   */
  upload?: boolean
  /** Ativa envio automático da Consent API v2 do Clarity. Padrão: true */
  consentMode?: boolean
  /** Categoria usada para `analytics_Storage` no Clarity Consent API v2. Padrão: 'analytics'. */
  analyticsStorageCategory?: string
  /** Categoria usada para `ad_Storage` no Clarity Consent API v2. Padrão: 'marketing'. */
  adStorageCategory?: string
  /** URL do script Clarity. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Configuração para integração do Intercom.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: IntercomConfig = {
 *   app_id: 'your-app-id'
 * }
 * ```
 */
export interface IntercomConfig {
  /** ID da aplicação Intercom */
  app_id: string
  /** Base regional da API Intercom. Padrão: 'https://api-iam.intercom.io'. */
  api_base?: string
  /** Configurações adicionais enviadas para `window.intercomSettings` e `Intercom('boot')`. */
  settings?: Record<string, unknown>
  /** Se deve executar `Intercom('boot', ...)` após carregar o widget. Padrão: true. */
  boot?: boolean
  /** Se deve executar `Intercom('update')` quando o consentimento segue permitido. Padrão: true. */
  updateOnConsent?: boolean
  /** Se deve executar `Intercom('shutdown')` quando o consentimento é revogado. Padrão: true. */
  shutdownOnRevoke?: boolean
  /** URL do script Intercom. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Configuração para integração do Zendesk Chat.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: ZendeskConfig = {
 *   key: 'your-zendesk-key'
 * }
 * ```
 */
export interface ZendeskConfig {
  /** Categoria de analytics usada para liberar todos os cookies. Padrão: analytics. */
  analyticsStorageCategory?: string
  /** Chave de identificação do Zendesk */
  key: string
  /**
   * Intervalo de cookies inicial para o Web Widget Messaging.
   * Se omitido, a biblioteca só sincroniza quando o consentimento muda.
   */
  cookieRange?: 'all' | 'functional' | 'none'
  /** Se deve sincronizar cookies via API Messaging atual. Padrão: true. */
  syncCookies?: boolean
  /** URL do script Zendesk. Se omitido usa o padrão oficial. */
  scriptUrl?: string
  /** Categoria LGPD customizada (opcional). */
  category?: string
}

/**
 * Cria integração do Facebook Pixel.
 * Configura o fbq e inicializa o pixel com tracking automático opcional.
 *
 * @category Utils
 * @param config - Configuração do Facebook Pixel
 * @returns Integração configurada para o Facebook Pixel
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const pixel = createFacebookPixelIntegration({
 *   pixelId: '1234567890123456',
 *   autoTrack: true
 * })
 * ```
 *
 * @remarks
 * - Define cookies: _fbp, fr
 * - Categoria padrão: 'marketing'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createFacebookPixelIntegration(config: FacebookPixelConfig): ScriptIntegration {
  const category = resolveCategory('marketing', config.category)
  const pixelId = resolveRequiredString(config.pixelId, 'pixelId', 'facebook-pixel')
  if (!pixelId) {
    return {
      id: 'facebook-pixel',
      category,
      src: '',
      cookies: ['_fbp', 'fr'],
    }
  }
  const prepare = () => {
    const currentWindow = globalThis.window
    if (currentWindow !== undefined) {
      type FbqFn = ((...args: unknown[]) => void) & {
        queue?: unknown[]
        loaded?: boolean
        push?: FbqFn
        version?: string
        callMethod?: (...args: unknown[]) => void
      }
      const w = currentWindow as unknown as { fbq?: FbqFn; _fbq?: FbqFn }
      if (!w.fbq) {
        const fbq: FbqFn = (...args: unknown[]) => {
          if (w.fbq && typeof w.fbq.callMethod === 'function') {
            w.fbq.callMethod(...args)
          } else {
            fbq.queue = fbq.queue || []
            fbq.queue.push(args)
          }
        }
        fbq.loaded = true
        fbq.version = '2.0'
        fbq.queue = []
        fbq.push = fbq
        w.fbq = fbq
        w._fbq ??= fbq
      }
    }
  }
  const src = config.scriptUrl ?? 'https://connect.facebook.net/en_US/fbevents.js'
  return {
    id: 'facebook-pixel',
    category,
    src,
    cookies: ['_fbp', 'fr'],
    beforeLoad: (consent) => {
      prepare()
      const w = globalThis.window as unknown as { fbq?: (...args: unknown[]) => void }
      w?.fbq?.('consent', consent.consented && consent.preferences[category] ? 'grant' : 'revoke')
    },
    onConsentUpdate: (consent) => {
      if (globalThis.window === undefined) return
      const w = window as unknown as { fbq?: (...args: unknown[]) => void }
      w.fbq?.('consent', consent.consented && consent.preferences[category] ? 'grant' : 'revoke')
    },
    init: () => {
      prepare()
      if (globalThis.window !== undefined) {
        const w = window as unknown as { fbq: (...args: unknown[]) => void }
        w.fbq('init', pixelId, config.advancedMatching ?? {})
        if (config.autoTrack !== false) w.fbq('track', 'PageView')
      }
    },
  }
}

/**
 * Cria integração do Hotjar.
 * Configura as configurações do Hotjar e inicializa o tracking de heatmaps e gravações.
 *
 * @category Utils
 * @param config - Configuração do Hotjar
 * @returns Integração configurada para o Hotjar
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const hotjar = createHotjarIntegration({
 *   siteId: '1234567',
 *   debug: true
 * })
 * ```
 *
 * @remarks
 * - Define cookies: _hjSession_*, _hjSessionUser_*, _hjFirstSeen, _hjIncludedInSessionSample, _hjAbsoluteSessionInProgress
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createHotjarIntegration(config: HotjarConfig): ScriptIntegration {
  const category = resolveCategory('analytics', config.category)
  const siteId = resolveRequiredString(config.siteId, 'siteId', 'hotjar')
  const v = config.version ?? 6
  if (!siteId) {
    return {
      id: 'hotjar',
      category,
      src: '',
      cookies: [
        '_hjSession_*',
        '_hjSessionUser_*',
        '_hjFirstSeen',
        '_hjIncludedInSessionSample',
        '_hjAbsoluteSessionInProgress',
      ],
    }
  }
  let started = false
  const src = config.scriptUrl ?? `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=${v}`
  return {
    id: 'hotjar',
    category,
    src,
    cookies: [
      '_hjSession_*',
      '_hjSessionUser_*',
      '_hjFirstSeen',
      '_hjIncludedInSessionSample',
      '_hjAbsoluteSessionInProgress',
    ],
    cookiesInfo: [
      {
        name: '_hjSession_*',
        purpose: 'Identificação única da sessão de gravação e heatmaps',
        duration: '30 minutos',
        provider: 'Hotjar',
      },
      {
        name: '_hjSessionUser_*',
        purpose: 'Identificação persistente do usuário entre sessões',
        duration: '365 dias',
        provider: 'Hotjar',
      },
      {
        name: '_hjFirstSeen',
        purpose: 'Detecção de primeira visita do usuário ao site',
        duration: 'Sessão',
        provider: 'Hotjar',
      },
      {
        name: '_hjIncludedInSessionSample',
        purpose: 'Indica se a sessão está incluída na amostra de gravação',
        duration: '30 minutos',
        provider: 'Hotjar',
      },
      {
        name: '_hjAbsoluteSessionInProgress',
        purpose: 'Detecta se uma sessão absoluta está em progresso',
        duration: '30 minutos',
        provider: 'Hotjar',
      },
    ],
    onConsentUpdate: ({ consented, preferences }) => {
      if (started && !(consented && preferences[category])) {
        started = false
        if (config.onRevoke) config.onRevoke()
        else globalThis.window?.location.reload()
      }
    },
    beforeLoad: () => {
      started = true
      const currentWindow = globalThis.window
      if (currentWindow !== undefined) {
        type HjFn = ((...args: unknown[]) => void) & { q?: unknown[] }
        const w = currentWindow as unknown as {
          hj?: HjFn
          _hjSettings?: { hjid: number; hjsv: number; hjdebug: boolean }
        }
        w._hjSettings = { hjid: Number(siteId), hjsv: v, hjdebug: config.debug ?? false }
        if (!w.hj) {
          const hj: HjFn = (...args: unknown[]) => {
            hj.q = hj.q || []
            hj.q.push(args)
          }
          w.hj = hj
        }
        if (config.debug && typeof console !== 'undefined' && typeof console.info === 'function') {
          console.info('[Hotjar] initialized with siteId', siteId)
        }
      }
    },
  }
}

/**
 * Cria integração do Mixpanel.
 * Configura e inicializa o Mixpanel para analytics de eventos.
 *
 * @category Utils
 * @param config - Configuração do Mixpanel
 * @returns Integração configurada para o Mixpanel
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const mixpanel = createMixpanelIntegration({
 *   token: 'your-project-token',
 *   config: { debug: true }
 * })
 * ```
 *
 * @remarks
 * - Define cookies: mp_*
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 * - Inclui tratamento de erro na inicialização
 */
export function createMixpanelIntegration(config: MixpanelConfig): ScriptIntegration {
  const category = resolveCategory('analytics', config.category)
  const token = resolveRequiredString(config.token, 'token', 'mixpanel')
  if (!token) {
    return {
      id: 'mixpanel',
      category,
      src: '',
      cookies: ['mp_*'],
      cookiesInfo: [
        {
          name: 'mp_*',
          purpose: 'Rastreamento de eventos e propriedades do usuário para analytics',
          duration: '1 ano',
          provider: 'Mixpanel',
        },
      ],
    }
  }
  const src = config.scriptUrl ?? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
  return {
    id: 'mixpanel',
    category,
    src,
    cookies: ['mp_*'],
    cookiesInfo: [
      {
        name: 'mp_*',
        purpose: 'Rastreamento de eventos e propriedades do usuário para analytics',
        duration: '1 ano',
        provider: 'Mixpanel',
      },
    ],
    beforeLoad: () => {
      if (globalThis.window === undefined) return
      const w = window as unknown as { mixpanel?: unknown }
      if (!w.mixpanel) {
        // O bundle CDN exige o marcador do snippet, mesmo com init após onload.
        w.mixpanel = Object.assign([], { __SV: 1.2, _i: [], people: [] })
      }
    },
    onConsentUpdate: ({ consented, preferences }) => {
      if (globalThis.window === undefined) return
      const w = window as unknown as {
        mixpanel?: { opt_in_tracking?: (options: object) => void; opt_out_tracking?: () => void }
      }
      if (consented && preferences[category]) w.mixpanel?.opt_in_tracking?.({ track: false })
      else w.mixpanel?.opt_out_tracking?.()
    },
    init: () => {
      const currentWindow = globalThis.window
      if (currentWindow !== undefined) {
        const w = currentWindow as unknown as { mixpanel?: { init?: (...a: unknown[]) => void } }
        w.mixpanel = w.mixpanel || {}
        if (w.mixpanel && typeof w.mixpanel.init === 'function') {
          try {
            w.mixpanel.init(token, {
              ...config.config,
              ...(config.api_host ? { api_host: config.api_host } : {}),
            })
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

/**
 * Cria integração do Microsoft Clarity.
 * Configura o Microsoft Clarity para heatmaps e analytics de comportamento.
 *
 * @category Utils
 * @param config - Configuração do Microsoft Clarity
 * @returns Integração configurada para o Clarity
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const clarity = createClarityIntegration({
 *   projectId: 'abcdefghij',
 *   consentMode: true
 * })
 * ```
 *
 * @remarks
 * - Define cookies: _clck, _clsk, CLID, ANONCHK, MR, MUID, SM
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 * - Configuração de upload opcional
 */
export function createClarityIntegration(config: ClarityConfig): ScriptIntegration {
  const category = resolveCategory('analytics', config.category)
  const projectId = resolveRequiredString(config.projectId, 'projectId', 'clarity')
  if (!projectId) {
    return {
      id: 'clarity',
      category,
      src: '',
      cookies: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'],
    }
  }
  const src = config.scriptUrl ?? `https://www.clarity.ms/tag/${projectId}`
  const consentMode = config.consentMode ?? true
  const analyticsCategory = config.analyticsStorageCategory ?? category
  const adCategory = config.adStorageCategory ?? 'marketing'

  const buildClarityConsent = (preferences: ConsentPreferences) => ({
    ad_Storage: (preferences[adCategory] ? 'granted' : 'denied') as ConsentStorageValue,
    analytics_Storage: (preferences[analyticsCategory]
      ? 'granted'
      : 'denied') as ConsentStorageValue,
  })

  const sendClarityConsent = (preferences: ConsentPreferences) => {
    const currentWindow = globalThis.window
    if (currentWindow === undefined || !consentMode) return
    const w = currentWindow as unknown as { clarity?: (...args: unknown[]) => void }
    if (typeof w.clarity !== 'function') return
    try {
      w.clarity('consentv2', buildClarityConsent(preferences))
    } catch (error) {
      if (typeof console !== 'undefined' && typeof console.warn === 'function') {
        console.warn('[Clarity] Failed to send consentv2:', error)
      }
    }
  }

  return {
    id: 'clarity',
    category,
    src,
    cookies: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'],
    beforeLoad: ({ consented, preferences }) => {
      if (globalThis.window === undefined) return
      const w = window as unknown as {
        clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }
      }
      if (typeof w.clarity !== 'function') {
        const clarity = Object.assign(
          (...args: unknown[]) => {
            clarity.q.push(args)
          },
          { q: [] as unknown[] },
        )
        w.clarity = clarity
      }
      sendClarityConsent(consented ? preferences : { necessary: true })
    },
    init: () => {
      if (config.upload !== undefined)
        logger.warn('[Clarity] upload is deprecated and has no effect; use consentMode.')
    },
    onConsentUpdate: ({ consented, preferences }) => {
      sendClarityConsent(consented ? preferences : { necessary: true })
    },
  }
}

/**
 * Cria integração do Intercom.
 * Configura o widget de chat e suporte do Intercom.
 *
 * @category Utils
 * @param config - Configuração do Intercom
 * @returns Integração configurada para o Intercom
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const intercom = createIntercomIntegration({
 *   app_id: 'your-app-id'
 * })
 * ```
 *
 * @remarks
 * - Define cookies: intercom-id-*, intercom-session-*
 * - Categoria padrão: 'functional'
 * - SSR-safe: verifica disponibilidade do window
 * - Inclui tratamento de erro na inicialização
 */
export function createIntercomIntegration(config: IntercomConfig): ScriptIntegration {
  const category = resolveCategory('functional', config.category)
  const appId = resolveRequiredString(config.app_id, 'app_id', 'intercom')
  if (!appId) {
    return {
      id: 'intercom',
      category,
      src: '',
      cookies: ['intercom-id-*', 'intercom-session-*'],
    }
  }
  const src = config.scriptUrl ?? `https://widget.intercom.io/widget/${appId}`
  const apiBase = config.api_base ?? 'https://api-iam.intercom.io'
  let shutDown = false
  const buildSettings = () => ({
    api_base: apiBase,
    app_id: appId,
    ...(config.settings ?? {}),
  })

  return {
    id: 'intercom',
    category,
    src,
    cookies: ['intercom-id-*', 'intercom-session-*'],
    beforeLoad: () => {
      if (globalThis.window === undefined) return
      const w = window as unknown as {
        Intercom?: ((...args: unknown[]) => void) & { q?: unknown[] }
        intercomSettings?: Record<string, unknown>
      }
      w.intercomSettings = buildSettings()
      if (typeof w.Intercom !== 'function') {
        const intercom = Object.assign(
          (...args: unknown[]) => {
            intercom.q.push(args)
          },
          { q: [] as unknown[] },
        )
        w.Intercom = intercom
      }
    },
    init: () => {
      const currentWindow = globalThis.window
      if (currentWindow !== undefined) {
        const w = currentWindow as unknown as {
          Intercom?: (...args: unknown[]) => void
          intercomSettings?: Record<string, unknown>
        }
        const settings = buildSettings()
        w.intercomSettings = settings
        if (typeof w.Intercom === 'function' && config.boot !== false) {
          try {
            w.Intercom('boot', settings)
          } catch (error) {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
              console.warn('[Intercom] Failed to boot:', error)
            }
          }
        }
      }
    },
    onConsentUpdate: ({ consented, preferences }) => {
      const currentWindow = globalThis.window
      if (currentWindow === undefined) return
      const w = currentWindow as unknown as { Intercom?: (...args: unknown[]) => void }
      if (typeof w.Intercom !== 'function') return
      const allowed = consented && Boolean(preferences[category])
      try {
        if (allowed && shutDown && config.boot !== false) {
          w.Intercom('boot', buildSettings())
          shutDown = false
        } else if (allowed && config.updateOnConsent !== false) {
          w.Intercom('update')
        } else if (!allowed && config.shutdownOnRevoke !== false) {
          w.Intercom('shutdown')
          shutDown = true
        }
      } catch (error) {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
          console.warn('[Intercom] Failed to sync consent:', error)
        }
      }
    },
  }
}

/**
 * Cria integração do Zendesk Messaging (nome legado preservado).
 * Configura o widget de chat e suporte do Zendesk.
 *
 * @category Utils
 * @param config - Configuração do Zendesk Chat
 * @returns Integração configurada para o Zendesk Chat
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const zendesk = createZendeskChatIntegration({
 *   key: 'your-zendesk-key'
 * })
 * ```
 *
 * @remarks
 * - Messaging utiliza também localStorage; não reutiliza o catálogo do Chat Classic.
 * - Categoria padrão: 'functional'
 * - SSR-safe: verifica disponibilidade do window
 * - Inclui tratamento de erro na identificação
 */
export function createZendeskChatIntegration(config: ZendeskConfig): ScriptIntegration {
  const category = resolveCategory('functional', config.category)
  const key = resolveRequiredString(config.key, 'key', 'zendesk-chat')
  if (!key) {
    return {
      id: 'zendesk-chat',
      category,
      src: '',
      cookies: [],
    }
  }
  const src = config.scriptUrl ?? `https://static.zdassets.com/ekr/snippet.js?key=${key}`
  let preparedRange: 'all' | 'functional' | 'none' | undefined
  const resolveZendeskCookieRange = (consent: {
    consented: boolean
    preferences: ConsentPreferences
  }): 'all' | 'functional' | 'none' => {
    if (!consent.consented || !consent.preferences[category]) return 'none'
    return consent.preferences[config.analyticsStorageCategory ?? 'analytics']
      ? 'all'
      : 'functional'
  }

  const sendZendeskCookieRange = (range: 'all' | 'functional' | 'none') => {
    const currentWindow = globalThis.window
    if (currentWindow === undefined) return
    const w = currentWindow as unknown as { zE?: (...args: unknown[]) => void }
    if (typeof w.zE !== 'function') return
    try {
      w.zE('messenger:set', 'cookies', range)
    } catch (error) {
      if (typeof console !== 'undefined' && typeof console.warn === 'function') {
        console.warn('[Zendesk] Failed to sync cookie consent:', error)
      }
    }
  }

  return {
    id: 'zendesk-chat',
    category,
    src,
    attrs: { id: 'ze-snippet' },
    cookies: [],
    beforeLoad: (consent) => {
      if (globalThis.window === undefined || config.syncCookies === false) return
      const w = window as unknown as { zE?: ((...args: unknown[]) => void) & { q?: unknown[] } }
      if (typeof w.zE !== 'function') {
        const zE = Object.assign(
          function (..._args: unknown[]) {
            // eslint-disable-next-line prefer-rest-params -- snippet oficial usa Arguments, não Array
            zE.q.push(arguments)
          },
          { q: [] as unknown[] },
        )
        w.zE = zE
      }
      const permitted = resolveZendeskCookieRange(consent)
      preparedRange =
        permitted === 'none' || config.cookieRange === 'none'
          ? 'none'
          : permitted === 'functional' || config.cookieRange === 'functional'
            ? 'functional'
            : 'all'
      sendZendeskCookieRange(preparedRange)
    },
    init: () => {
      if (config.syncCookies !== false && (preparedRange ?? config.cookieRange)) {
        sendZendeskCookieRange((preparedRange ?? config.cookieRange)!)
      }
    },
    onConsentUpdate: (consent) => {
      if (config.syncCookies === false) return
      sendZendeskCookieRange(resolveZendeskCookieRange(consent))
    },
  }
}

/**
 * Cria integração do Zendesk Web Widget Messaging. Não suporta Chat Classic.
 * @category Utils
 * @param config Configuração do widget Messaging.
 * @returns Integração do widget com sincronização de cookies.
 * @example createZendeskMessagingIntegration({ key: 'widget-key' })
 */
export function createZendeskMessagingIntegration(config: ZendeskConfig): ScriptIntegration {
  return { ...createZendeskChatIntegration(config), id: 'zendesk-messaging' }
}

/**
 * Configuração para conjunto de integrações de e-commerce.
 * Define configurações opcionais para múltiplas integrações otimizadas para e-commerce.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: ECommerceConfig = {
 *   googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
 *   facebookPixel: { pixelId: '1234567890123456' }
 * }
 * ```
 */
export interface ECommerceConfig {
  /** Configuração do Google Analytics */
  googleAnalytics?: GoogleAnalyticsConfig
  /** Configuração do Facebook Pixel */
  facebookPixel?: FacebookPixelConfig
  /** Configuração do Hotjar */
  hotjar?: HotjarConfig
  /** Configuração do UserWay */
  userway?: UserWayConfig
}

/**
 * Configuração para conjunto de integrações de SaaS.
 * Define configurações opcionais para múltiplas integrações otimizadas para SaaS.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: SaaSConfig = {
 *   googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
 *   mixpanel: { token: 'your-token' },
 *   intercom: { app_id: 'your-app-id' }
 * }
 * ```
 */
export interface SaaSConfig {
  /** Configuração do Google Analytics */
  googleAnalytics?: GoogleAnalyticsConfig
  /** Configuração do Mixpanel */
  mixpanel?: MixpanelConfig
  /** Configuração do Intercom */
  intercom?: IntercomConfig
  /** Configuração do Hotjar */
  hotjar?: HotjarConfig
}

/**
 * Configuração para conjunto de integrações corporativas.
 * Define configurações opcionais para múltiplas integrações otimizadas para ambientes corporativos.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const config: CorporateConfig = {
 *   googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
 *   clarity: { projectId: 'abcdefghij' },
 *   userway: { accountId: 'XXXXXXXXXX' }
 * }
 * ```
 */
export interface CorporateConfig {
  /** Configuração do Google Analytics */
  googleAnalytics?: GoogleAnalyticsConfig
  /** Configuração do Microsoft Clarity */
  clarity?: ClarityConfig
  /** Configuração do Zendesk Chat */
  zendesk?: ZendeskConfig
  /** Configuração do UserWay */
  userway?: UserWayConfig
}

/**
 * Cria conjunto de integrações otimizado para e-commerce.
 * Combina analytics de conversão, remarketing e acessibilidade.
 *
 * @category Utils
 * @param cfg - Configuração das integrações de e-commerce
 * @returns Array de integrações configuradas
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const integrations = createECommerceIntegrations({
 *   googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
 *   facebookPixel: { pixelId: '1234567890123456' }
 * })
 * ```
 *
 * @remarks
 * Combina categorias: analytics, marketing, functional
 */
export function createECommerceIntegrations(cfg: ECommerceConfig): ScriptIntegration[] {
  const list: ScriptIntegration[] = []
  if (cfg.googleAnalytics) list.push(createGoogleAnalyticsIntegration(cfg.googleAnalytics))
  if (cfg.facebookPixel) list.push(createFacebookPixelIntegration(cfg.facebookPixel))
  if (cfg.hotjar) list.push(createHotjarIntegration(cfg.hotjar))
  if (cfg.userway) list.push(createUserWayIntegration(cfg.userway))
  return list
}

/**
 * Cria conjunto de integrações otimizado para SaaS.
 * Combina analytics de produto, suporte ao cliente e comportamento do usuário.
 *
 * @category Utils
 * @param cfg - Configuração das integrações de SaaS
 * @returns Array de integrações configuradas
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const integrations = createSaaSIntegrations({
 *   googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
 *   mixpanel: { token: 'your-project-token' },
 *   intercom: { app_id: 'your-app-id' }
 * })
 * ```
 *
 * @remarks
 * Combina categorias: analytics, functional
 */
export function createSaaSIntegrations(cfg: SaaSConfig): ScriptIntegration[] {
  const list: ScriptIntegration[] = []
  if (cfg.googleAnalytics) list.push(createGoogleAnalyticsIntegration(cfg.googleAnalytics))
  if (cfg.mixpanel) list.push(createMixpanelIntegration(cfg.mixpanel))
  if (cfg.intercom) list.push(createIntercomIntegration(cfg.intercom))
  if (cfg.hotjar) list.push(createHotjarIntegration(cfg.hotjar))
  return list
}

/**
 * Cria conjunto de integrações otimizado para ambientes corporativos.
 * Combina analytics empresariais, compliance e suporte corporativo.
 *
 * @category Utils
 * @param cfg - Configuração das integrações corporativas
 * @returns Array de integrações configuradas
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const integrations = createCorporateIntegrations({
 *   googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
 *   clarity: { projectId: 'abcdefghij' },
 *   userway: { accountId: 'XXXXXXXXXX' }
 * })
 * ```
 *
 * @remarks
 * Combina categorias: analytics, functional
 */
export function createCorporateIntegrations(cfg: CorporateConfig): ScriptIntegration[] {
  const list: ScriptIntegration[] = []
  if (cfg.googleAnalytics) list.push(createGoogleAnalyticsIntegration(cfg.googleAnalytics))
  if (cfg.clarity) list.push(createClarityIntegration(cfg.clarity))
  if (cfg.zendesk) list.push(createZendeskChatIntegration(cfg.zendesk))
  if (cfg.userway) list.push(createUserWayIntegration(cfg.userway))
  return list
}

/**
 * Templates pré-configurados de integrações por tipo de negócio.
 * Define integrações essenciais e opcionais para cada contexto.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * const template = INTEGRATION_TEMPLATES.ecommerce
 * console.log(template.essential) // ['google-analytics', 'facebook-pixel']
 * console.log(template.categories) // ['analytics', 'marketing', 'functional']
 * ```
 *
 * @remarks
 * Cada template define:
 * - essential: integrações obrigatórias/recomendadas
 * - optional: integrações complementares
 * - categories: categorias LGPD utilizadas
 */
export const INTEGRATION_TEMPLATES = {
  ecommerce: {
    essential: ['google-analytics', 'facebook-pixel'],
    optional: ['hotjar', 'userway'],
    categories: ['analytics', 'marketing', 'functional'],
  },
  saas: {
    essential: ['google-analytics', 'mixpanel'],
    optional: ['intercom', 'hotjar'],
    categories: ['analytics', 'functional'],
  },
  corporate: {
    essential: ['google-analytics'],
    optional: ['userway', 'zendesk-chat', 'clarity'],
    categories: ['analytics', 'functional'],
  },
}

/**
 * Sugere categorias LGPD apropriadas para um script baseado no nome/tipo.
 * Utiliza heurísticas para classificar scripts desconhecidos.
 *
 * @category Utils
 * @param name - Nome ou identificador do script
 * @returns Array de categorias sugeridas
 * @since 0.4.1
 *
 * @example
 * ```typescript
 * suggestCategoryForScript('facebook-pixel') // ['marketing']
 * suggestCategoryForScript('hotjar') // ['analytics']
 * suggestCategoryForScript('intercom-chat') // ['functional']
 * suggestCategoryForScript('unknown-script') // ['analytics']
 * ```
 *
 * @remarks
 * Heurísticas aplicadas:
 * - Scripts de ads/marketing → 'marketing'
 * - Scripts de analytics/tracking → 'analytics'
 * - Scripts de chat/suporte → 'functional'
 * - Padrão para desconhecidos → 'analytics'
 */
export function suggestCategoryForScript(name: string): string[] {
  const n = name.toLowerCase()
  if (n.includes('facebook') || n.includes('pixel') || n.includes('ads')) return ['marketing']
  if (n.includes('hotjar') || n.includes('mixpanel') || n.includes('clarity')) return ['analytics']
  if (n.includes('intercom') || n.includes('zendesk') || n.includes('chat')) return ['functional']
  return ['analytics']
}
