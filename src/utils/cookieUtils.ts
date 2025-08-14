import Cookies from 'js-cookie'

/**
 * @fileoverview
 * Utilitários para manipulação do cookie de consentimento.
 * A estrutura de dados do cookie é um JSON simples para atender aos requisitos da LGPD,
 * e não implementa o padrão IAB TCF, que é mais complexo.
 * Veja `src/types/types.ts` para a definição da estrutura `ConsentCookieData`.
 */

import type {
  ConsentCookieOptions,
  ConsentState,
  ProjectCategoriesConfig,
} from '../types/types'
import { logger } from './logger'

/**
 * Opções padrão para persistência do cookie de consentimento.
 *
 * @remarks
 * - `name`: Nome do cookie.
 * - `maxAgeDays`: Dias de validade.
 * - `sameSite`: Política SameSite.
 * - `secure`: Apenas HTTPS.
 * - `path`: Caminho do cookie.
 */
export const DEFAULT_COOKIE_OPTS: ConsentCookieOptions = {
  name: 'cookieConsent',
  maxAgeDays: 365,
  sameSite: 'Lax',
  secure:
    typeof window !== 'undefined'
      ? window.location.protocol === 'https:'
      : false,
  path: '/',
}

/**
 * Versão atual do esquema do cookie para controle de migração.
 */
const COOKIE_SCHEMA_VERSION = '1.0'

/**
 * @function
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
export function readConsentCookie(
  name: string = DEFAULT_COOKIE_OPTS.name,
): ConsentState | null {
  logger.debug('Reading consent cookie', { name })

  if (typeof document === 'undefined') {
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

    if (!data.version) {
      logger.debug('Migrating legacy cookie format')
      return migrateLegacyCookie(data)
    }

    if (data.version !== COOKIE_SCHEMA_VERSION) {
      logger.warn(
        `Cookie version mismatch: ${data.version} != ${COOKIE_SCHEMA_VERSION}`,
      )
      return null
    }

    return data as ConsentState
  } catch (error) {
    logger.error('Error parsing consent cookie', error)
    return null
  }
}

/**
 * @function
 * Migra cookies de versões legadas (anteriores à v1.0 do esquema) para o formato atual.
 *
 * @param {any} legacyData Os dados do cookie no formato legado.
 * @returns {ConsentState | null} O estado de consentimento migrado para o formato atual, ou `null` se a migração falhar.
 */
function migrateLegacyCookie(legacyData: any): ConsentState | null {
  try {
    const now = new Date().toISOString()

    return {
      version: COOKIE_SCHEMA_VERSION,
      consented: legacyData.consented || false,
      preferences: legacyData.preferences || { necessary: true },
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
 * Persiste o estado de consentimento atual no cookie do navegador.
 *
 * @param {ConsentState} state O estado de consentimento a ser salvo.
 * @param {ProjectCategoriesConfig} config A configuração de categorias do projeto associada a este consentimento.
 * @param {Partial<ConsentCookieOptions>} [opts] Opções adicionais para o cookie (ex: `maxAgeDays`, `sameSite`).
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
  if (typeof document === 'undefined') {
    logger.debug('Cookie write skipped: server-side environment')
    return
  }

  const now = new Date().toISOString()
  const o = { ...DEFAULT_COOKIE_OPTS, ...opts }

  const cookieData = {
    version: COOKIE_SCHEMA_VERSION,
    consented: state.consented,
    preferences: state.preferences,
    consentDate: state.consentDate || now,
    lastUpdate: now,
    source: source,
    projectConfig: config,
  }

  logger.cookieOperation('write', o.name, cookieData)

  Cookies.set(o.name, JSON.stringify(cookieData), {
    expires: o.maxAgeDays,
    sameSite: o.sameSite,
    secure: o.secure,
    path: o.path,
  })

  logger.info('Consent cookie saved', {
    consented: cookieData.consented,
    source: cookieData.source,
    preferencesCount: Object.keys(cookieData.preferences).length,
  })
}

/**
 * @function
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
 * Remove o cookie de consentimento do navegador.
 *
 * @param {Partial<ConsentCookieOptions>} [opts] Opções adicionais para a remoção do cookie (ex: `path`).
 *
 * @remarks
 * - Não executa em ambiente de servidor (SSR).
 * - Usa as opções padrão do cookie se não forem especificadas.
 */
export function removeConsentCookie(opts?: Partial<ConsentCookieOptions>) {
  if (typeof document === 'undefined') {
    logger.debug('Cookie removal skipped: server-side environment')
    return
  }

  const o = { ...DEFAULT_COOKIE_OPTS, ...opts }
  logger.cookieOperation('delete', o.name)
  Cookies.remove(o.name, { path: o.path })
  logger.info('Consent cookie removed')
}