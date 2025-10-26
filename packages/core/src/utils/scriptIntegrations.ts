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
  /** Atributos HTML adicionais para a tag script */
  attrs?: Record<string, string>
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
 * Configuração para integração do Google Analytics (GA4).
 *
 * @category Utils
 * @since 0.2.0
 *
 * @example
 * ```typescript
 * const config: GoogleAnalyticsConfig = {
 *   measurementId: 'G-XXXXXXXXXX',
 *   config: { anonymize_ip: true }
 * }
 * ```
 */
export interface GoogleAnalyticsConfig {
  /** ID de medição do GA4 (formato: G-XXXXXXXXXX) */
  measurementId: string
  /** Configurações adicionais para o gtag */
  config?: Record<string, unknown>
  /** URL do script GA4. Se omitido usa o padrão oficial. */
  scriptUrl?: string
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
export interface GoogleTagManagerConfig {
  /** ID do container GTM (formato: GTM-XXXXXXX) */
  containerId: string
  /** Nome customizado para o dataLayer. Padrão: 'dataLayer' */
  dataLayerName?: string
  /** URL do script GTM. Se omitido usa o padrão oficial. */
  scriptUrl?: string
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
 *   config: { anonymize_ip: true }
 * })
 * ```
 *
 * @remarks
 * - Define cookies: _ga, _ga_*, _gid
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createGoogleAnalyticsIntegration(config: GoogleAnalyticsConfig): ScriptIntegration {
  const src =
    config.scriptUrl ?? `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`
  return {
    id: 'google-analytics',
    category: 'analytics',
    src,
    cookies: ['_ga', '_ga_*', '_gid'],
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
      {
        name: '_gid',
        purpose: 'Distinção de visitantes únicos em período de 24h',
        duration: '24 horas',
        provider: 'Google Analytics',
      },
    ],
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
 * - Define cookies: _gcl_au
 * - Categoria padrão: 'analytics'
 * - SSR-safe: verifica disponibilidade do window
 */
export function createGoogleTagManagerIntegration(
  config: GoogleTagManagerConfig,
): ScriptIntegration {
  const src = config.scriptUrl ?? `https://www.googletagmanager.com/gtm.js?id=${config.containerId}`
  return {
    id: 'google-tag-manager',
    category: 'analytics',
    src,
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
  const src = config.scriptUrl ?? 'https://cdn.userway.org/widget.js'
  return {
    id: 'userway',
    category: 'functional',
    src,
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
  /** ID do site no Hotjar */
  siteId: string
  /** Versão do script Hotjar. Padrão: 6 */
  version?: number
  /** Ativar modo debug. Padrão: false */
  debug?: boolean
  /** URL do script Hotjar. Se omitido usa o padrão oficial. */
  scriptUrl?: string
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
}

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
 *   upload: true
 * }
 * ```
 */
export interface ClarityConfig {
  /** ID do projeto no Microsoft Clarity */
  projectId: string
  /** Configuração de upload de dados. Padrão: indefinido */
  upload?: boolean
  /** URL do script Clarity. Se omitido usa o padrão oficial. */
  scriptUrl?: string
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
  /** URL do script Intercom. Se omitido usa o padrão oficial. */
  scriptUrl?: string
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
  /** Chave de identificação do Zendesk */
  key: string
  /** URL do script Zendesk. Se omitido usa o padrão oficial. */
  scriptUrl?: string
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
  const src = config.scriptUrl ?? 'https://connect.facebook.net/en_US/fbevents.js'
  return {
    id: 'facebook-pixel',
    category: 'marketing',
    src,
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
          const fbq: FbqFn = (...args: unknown[]) => {
            if (w.fbq && typeof w.fbq.callMethod === 'function') {
              w.fbq.callMethod(...args)
            } else {
              fbq.queue = fbq.queue || []
              fbq.queue.push(args)
            }
          }
          fbq.loaded = true
          w.fbq = fbq
        }
        w.fbq('init', config.pixelId, config.advancedMatching ?? {})
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
  const v = config.version ?? 6
  const src = config.scriptUrl ?? `https://static.hotjar.com/c/hotjar-${config.siteId}.js?sv=${v}`
  return {
    id: 'hotjar',
    category: 'analytics',
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
    init: () => {
      if (typeof window !== 'undefined') {
        type HjFn = ((...args: unknown[]) => void) & { q?: unknown[] }
        const w = window as unknown as { hj?: HjFn; _hjSettings?: { hjid: string; hjsv: number } }
        w._hjSettings = { hjid: config.siteId, hjsv: v }
        if (!w.hj) {
          const hj: HjFn = (...args: unknown[]) => {
            hj.q = hj.q || []
            hj.q.push(args)
          }
          w.hj = hj
        }
        if (config.debug && typeof console !== 'undefined' && typeof console.info === 'function') {
          console.info('[Hotjar] initialized with siteId', config.siteId)
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
  const src = config.scriptUrl ?? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
  return {
    id: 'mixpanel',
    category: 'analytics',
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
 *   upload: false
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
  const src = config.scriptUrl ?? `https://www.clarity.ms/tag/${config.projectId}`
  return {
    id: 'clarity',
    category: 'analytics',
    src,
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
  const src = config.scriptUrl ?? `https://widget.intercom.io/widget/${config.app_id}`
  return {
    id: 'intercom',
    category: 'functional',
    src,
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

/**
 * Cria integração do Zendesk Chat.
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
 * - Define cookies: __zlcmid, _zendesk_shared_session
 * - Categoria padrão: 'functional'
 * - SSR-safe: verifica disponibilidade do window
 * - Inclui tratamento de erro na identificação
 */
export function createZendeskChatIntegration(config: ZendeskConfig): ScriptIntegration {
  const src = config.scriptUrl ?? `https://static.zdassets.com/ekr/snippet.js?key=${config.key}`
  return {
    id: 'zendesk-chat',
    category: 'functional',
    src,
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
