import Cookies from 'js-cookie'

/**
 * @fileoverview
 * Utilitários para manipulação do cookie de consentimento.
 * A estrutura de dados do cookie é um JSON simples para atender aos requisitos da LGPD,
 * e não implementa o padrão IAB TCF, que é mais complexo.
 * Veja `src/types/types.ts` para a definição da estrutura `ConsentCookieData`.
 */

import type {
  ConsentAuditAction,
  ConsentAuditEntry,
  ConsentCookieOptions,
  ConsentEventOrigin,
  ConsentState,
  ProjectCategoriesConfig,
} from '../types/types'
import { ensureNecessaryAlwaysOn } from './categoryUtils'
import { logger } from './logger'

const DEFAULT_STORAGE_NAMESPACE = 'lgpd-consent'
const DEFAULT_STORAGE_VERSION = '1'
const DEFAULT_MAX_AGE_SECONDS = 365 * 24 * 60 * 60

/**
 * Gera o nome da chave de armazenamento (cookie/localStorage) combinando namespace e versão.
 * @param options.namespace Namespace lógico do consentimento (ex.: domínio raiz).
 * @param options.version Versão atual do consentimento (ex.: lote de políticas).
 */
export function buildConsentStorageKey(options?: {
  namespace?: string | null
  version?: string | null
}): string {
  const namespaceRaw = options?.namespace?.trim() || DEFAULT_STORAGE_NAMESPACE
  const versionRaw = options?.version?.trim() || DEFAULT_STORAGE_VERSION

  const sanitizedNamespace = namespaceRaw.replaceAll(/[^a-z0-9._-]+/gi, '-').toLowerCase()
  const sanitizedVersion = versionRaw.replaceAll(/[^a-z0-9._-]+/gi, '-').toLowerCase()

  return `${sanitizedNamespace}__v${sanitizedVersion}`
}

/**
 * Opções padrão para persistência do cookie de consentimento.
 *
 * @remarks
 * - `name`: Nome do cookie.
 * - `maxAge`: Validade em segundos (padrão: 365 dias).
 * - `sameSite`: Política SameSite.
 * - `secure`: Apenas HTTPS.
 * - `path`: Caminho do cookie.
 */
export const DEFAULT_COOKIE_OPTS: ConsentCookieOptions = {
  name: 'cookieConsent',
  maxAge: DEFAULT_MAX_AGE_SECONDS,
  maxAgeDays: 365,
  sameSite: 'Lax',
  secure: false,
  path: '/',
  domain: undefined,
}

type ResolvedCookieOptions = {
  name: string
  maxAge: number
  sameSite: 'Lax' | 'Strict' | 'None'
  secure: boolean
  path: string
  domain?: string
}

function resolveCookieOptions(opts?: Partial<ConsentCookieOptions>): ResolvedCookieOptions {
  const currentWindow = globalThis.window
  const currentLocation = globalThis.location
  const protocols = [currentWindow?.location?.protocol, currentLocation?.protocol].filter(
    Boolean,
  ) as string[]
  const forceHttps =
    (globalThis as unknown as { __LGPD_FORCE_HTTPS__?: boolean }).__LGPD_FORCE_HTTPS__ === true
  const isHttps = forceHttps || protocols.includes('https:')

  const maxAgeSecondsFromDays =
    typeof opts?.maxAgeDays === 'number' ? Math.max(0, opts.maxAgeDays * 24 * 60 * 60) : null
  const maxAgeSeconds =
    typeof opts?.maxAge === 'number'
      ? Math.max(0, opts.maxAge)
      : (maxAgeSecondsFromDays ?? DEFAULT_MAX_AGE_SECONDS)

  return {
    name: opts?.name ?? DEFAULT_COOKIE_OPTS.name,
    maxAge: maxAgeSeconds,
    sameSite: opts?.sameSite ?? DEFAULT_COOKIE_OPTS.sameSite ?? 'Lax',
    secure:
      typeof opts?.secure === 'boolean'
        ? opts.secure
        : isHttps
          ? true
          : (DEFAULT_COOKIE_OPTS.secure ?? false),
    path: opts?.path ?? DEFAULT_COOKIE_OPTS.path ?? '/',
    domain: opts?.domain ?? DEFAULT_COOKIE_OPTS.domain ?? undefined,
  }
}

/** @internal - exposto apenas para testes unitários */
export const __resolveCookieOptionsForTests = resolveCookieOptions

/**
 * Versão atual do esquema do cookie para controle de migração.
 */
const COOKIE_SCHEMA_VERSION = '1.0'

/**
 * @function
 * @category Utils
 * @since 0.1.0
 * Lê e desserializa o cookie de consentimento do navegador.
 *
 * @param {string} [name=DEFAULT_COOKIE_OPTS.name] O nome do cookie a ser lido.
 * @returns {ConsentState | null} O estado de consentimento lido do cookie, ou `null` se o cookie não existir, for inválido ou em ambiente de servidor.
 *
 * @remarks
 * - Retorna `null` em ambientes sem `document` (ex: SSR).
 * - Faz fallback para `null` em caso de erro de parsing ou versão de esquema incompatível.
 * - Realiza migração de cookies de versões legadas se necessário.
 */
export function readConsentCookie(name: string = DEFAULT_COOKIE_OPTS.name): ConsentState | null {
  logger.debug('Reading consent cookie', { name })

  if (globalThis.document === undefined) {
    logger.debug('Cookie read skipped: server-side environment')
    return null
  }

  const raw = Cookies.get(name)
  if (!raw) {
    logger.debug('No consent cookie found')
    return null
  }

  try {
    const data = JSON.parse(raw)
    logger.cookieOperation('read', name, data)

    if (!data || typeof data !== 'object') {
      logger.warn('Consent cookie malformed: payload is not an object')
      return null
    }

    if (!data.version) {
      logger.debug('Migrating legacy cookie format')
      return migrateLegacyCookie(data)
    }

    if (data.version !== COOKIE_SCHEMA_VERSION) {
      logger.warn(`Cookie version mismatch: ${data.version} != ${COOKIE_SCHEMA_VERSION}`)
      return null
    }

    const preferences =
      data && typeof (data as ConsentState).preferences === 'object'
        ? (data as ConsentState).preferences
        : { necessary: true }

    return {
      ...(data as ConsentState),
      preferences: ensureNecessaryAlwaysOn(preferences),
    }
  } catch (error) {
    logger.error('Error parsing consent cookie', error)
    return null
  }
}

/**
 * @function
 * Migra cookies de versões legadas (anteriores à v1.0 do esquema) para o formato atual.
 *
 * @param {Record<string, unknown>} legacyData Os dados do cookie no formato legado.
 * @returns {ConsentState | null} O estado de consentimento migrado para o formato atual, ou `null` se a migração falhar.
 */
function migrateLegacyCookie(legacyData: Record<string, unknown>): ConsentState | null {
  try {
    const now = new Date().toISOString()

    return {
      version: COOKIE_SCHEMA_VERSION,
      consented: Boolean(legacyData.consented) || false,
      preferences:
        legacyData.preferences && typeof legacyData.preferences === 'object'
          ? (legacyData.preferences as ConsentState['preferences'])
          : { necessary: true },
      consentDate: now,
      lastUpdate: now,
      source: 'banner',
      isModalOpen: false,
    }
  } catch {
    return null
  }
}

/**
 * @function
 * @category Utils
 * @since 0.1.0
 * Persiste o estado de consentimento atual no cookie do navegador.
 *
 * @param {ConsentState} state O estado de consentimento a ser salvo.
 * @param {ProjectCategoriesConfig} config A configuração de categorias do projeto associada a este consentimento.
 * @param {Partial<ConsentCookieOptions>} [opts] Opções adicionais para o cookie (ex: `maxAge`, `sameSite`).
 * @param {'banner' | 'modal' | 'programmatic'} [source='banner'] A origem da decisão de consentimento.
 *
 * @remarks
 * - Não executa em ambiente de servidor (SSR).
 * - Remove campos de UI (`isModalOpen`) que não devem ser persistidos no cookie.
 * - Inclui timestamps (`consentDate`, `lastUpdate`) e a configuração do projeto (`projectConfig`) para fins de auditoria.
 */
export function writeConsentCookie(
  state: ConsentState,
  config: ProjectCategoriesConfig,
  opts?: Partial<ConsentCookieOptions>,
  source: 'banner' | 'modal' | 'programmatic' = 'banner',
) {
  if (
    globalThis.document === undefined ||
    globalThis.window === undefined ||
    (globalThis as unknown as { __LGPD_SSR__?: boolean }).__LGPD_SSR__ === true
  ) {
    logger.debug('Cookie write skipped: server-side environment')
    return
  }

  const now = new Date().toISOString()
  const o = resolveCookieOptions(opts)
  const preferences = ensureNecessaryAlwaysOn(state.preferences)

  const cookieData = {
    version: COOKIE_SCHEMA_VERSION,
    consented: state.consented,
    preferences,
    consentDate: state.consentDate || now,
    lastUpdate: now,
    source: source,
    projectConfig: config,
  }

  logger.cookieOperation('write', o.name, cookieData)

  const expires = new Date(Date.now() + o.maxAge * 1000)

  Cookies.set(o.name, JSON.stringify(cookieData), {
    expires,
    sameSite: o.sameSite,
    secure: o.secure,
    path: o.path,
    domain: o.domain,
  })

  logger.info('Consent cookie saved', {
    consented: cookieData.consented,
    source: cookieData.source,
    preferencesCount: Object.keys(cookieData.preferences).length,
  })
}

/**
 * Cria um registro de auditoria com carimbo de tempo, versão e snapshot das preferências.
 * @category Utils
 * @since 0.7.0
 *
 * @param state Estado atual de consentimento.
 * @param params.storageKey Chave de armazenamento (cookie/localStorage) aplicada.
 * @param params.action Ação que disparou o registro.
 * @param params.consentVersion Versão lógica do consentimento (ex.: bump de política/termo).
 * @param params.origin Origem explícita da decisão (opcional).
 */
export function createConsentAuditEntry(
  state: ConsentState,
  params: {
    storageKey: string
    action: ConsentAuditAction
    consentVersion?: string | null
    origin?: ConsentEventOrigin
  },
): ConsentAuditEntry {
  const preferences = ensureNecessaryAlwaysOn(state.preferences)
  const now = new Date().toISOString()

  return {
    action: params.action,
    storageKey: params.storageKey,
    consentVersion: params.consentVersion?.trim() || '1',
    timestamp: now,
    consentDate: state.consentDate,
    lastUpdate: state.lastUpdate,
    consented: state.consented,
    preferences,
    version: state.version,
    source: params.origin ?? state.source,
    projectConfig: state.projectConfig,
  }
}

/**
 * @function
 * @category Utils
 * @since 0.1.0
 * Cria um estado inicial de consentimento para a biblioteca, conforme as diretrizes da LGPD.
 * Por padrão, o usuário ainda não interagiu e apenas os cookies necessários são considerados ativos.
 *
 * @returns {ConsentState} Um objeto `ConsentState` representando o estado inicial do consentimento.
 */
export function createInitialConsentState(): ConsentState {
  const now = new Date().toISOString()

  return {
    version: COOKIE_SCHEMA_VERSION,
    consented: false,
    preferences: { necessary: true },
    consentDate: now,
    lastUpdate: now,
    source: 'banner',
    isModalOpen: false,
  }
}

/**
 * @function
 * @category Utils
 * @since 0.1.0
 * Remove o cookie de consentimento do navegador.
 *
 * @param {Partial<ConsentCookieOptions>} [opts] Opções adicionais para a remoção do cookie (ex: `path`).
 *
 * @remarks
 * - Não executa em ambiente de servidor (SSR).
 * - Usa as opções padrão do cookie se não forem especificadas.
 */
export function removeConsentCookie(opts?: Partial<ConsentCookieOptions>) {
  if (globalThis.document === undefined) {
    logger.debug('Cookie removal skipped: server-side environment')
    return
  }

  const o = resolveCookieOptions(opts)
  logger.cookieOperation('delete', o.name)
  Cookies.remove(o.name, { path: o.path, domain: o.domain })
  logger.info('Consent cookie removed')
}
