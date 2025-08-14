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
 * Lê e desserializa o cookie de consentimento.
 *
 * @param name Nome do cookie (default: 'cookieConsent')
 * @returns Estado de consentimento ou `null` se não existir ou inválido.
 *
 * @remarks
 * - Seguro para ambientes sem `document` (retorna `null`).
 * - Faz fallback para `null` em caso de erro de parsing.
 * - Valida versão do esquema e migra se necessário.
 */
export function readConsentCookie(
  name: string = DEFAULT_COOKIE_OPTS.name,
): ConsentState | null {
  logger.debug('Reading consent cookie', { name })

  // Client-safe: Cookies só existe no browser
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

    // Migração de versões antigas (v0.1.x que não tinha versão)
    if (!data.version) {
      logger.debug('Migrating legacy cookie format')
      return migrateLegacyCookie(data)
    }

    // Validação de versão atual
    if (data.version !== COOKIE_SCHEMA_VERSION) {
      logger.warn(
        `Cookie version mismatch: ${data.version} != ${COOKIE_SCHEMA_VERSION}`,
      )
      return null // Força recriação com versão atual
    }

    return data as ConsentState
  } catch (error) {
    logger.error('Error parsing consent cookie', error)
    return null
  }
}

/**
 * Migra cookies da versão legacy (v0.1.x) para o formato atual.
 */
function migrateLegacyCookie(legacyData: any): ConsentState | null {
  try {
    const now = new Date().toISOString()

    return {
      version: COOKIE_SCHEMA_VERSION,
      consented: legacyData.consented || false,
      preferences: legacyData.preferences || { necessary: true },
      consentDate: now, // Não temos o original, usar data atual
      lastUpdate: now,
      source: 'banner', // Assumir origem banner
      isModalOpen: false, // Nunca persistir estado de UI
    }
  } catch {
    return null
  }
}

/**
 * Persiste o estado de consentimento no cookie.
 * Remove dados de UI (isModalOpen) antes de salvar.
 *
 * @param state Estado de consentimento a ser salvo.
 * @param source Origem da decisão de consentimento.
 * @param opts Opções adicionais para o cookie.
 *
 * @remarks
 * - Seguro para SSR (não executa no servidor).
 * - Remove campos de UI que não devem ser persistidos.
 * - Inclui timestamps para auditoria.
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

  // Criar dados do cookie sem estado de UI
  const cookieData = {
    version: COOKIE_SCHEMA_VERSION,
    consented: state.consented,
    preferences: state.preferences,
    consentDate: state.consentDate || now, // Preservar data original ou usar atual
    lastUpdate: now,
    source: source,
    projectConfig: config,
    // isModalOpen NÃO é persistido (campo de UI apenas)
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
 * Cria um estado inicial de consentimento conforme LGPD.
 * Por padrão, rejeita tudo exceto necessários.
 */
export function createInitialConsentState(): ConsentState {
  const now = new Date().toISOString()

  return {
    version: COOKIE_SCHEMA_VERSION,
    consented: false, // Usuário ainda não interagiu
    preferences: { necessary: true }, // Apenas essenciais por padrão
    consentDate: now,
    lastUpdate: now,
    source: 'banner',
    isModalOpen: false, // Estado de UI
  }
}

/**
 * Remove o cookie de consentimento.
 *
 * @param opts Opções adicionais para remoção.
 *
 * @remarks
 * - Seguro para SSR (não executa no servidor).
 * - Usa opções padrão se não especificado.
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
