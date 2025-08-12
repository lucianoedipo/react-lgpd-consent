import Cookies from 'js-cookie'
import type { ConsentCookieOptions, ConsentState } from '../types/types'

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
 * Lê e desserializa o cookie de consentimento.
 *
 * @param name Nome do cookie (default: 'cookieConsent')
 * @returns Estado de consentimento ou `null` se não existir ou inválido.
 *
 * @remarks
 * - Seguro para ambientes sem `document` (retorna `null`).
 * - Faz fallback para `null` em caso de erro de parsing.
 */
export function readConsentCookie<T = ConsentState>(
  name: string = DEFAULT_COOKIE_OPTS.name,
): T | null {
  // Client-safe: Cookies só existe no browser
  if (typeof document === 'undefined') return null
  const raw = Cookies.get(name)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Persiste o estado de consentimento no cookie.
 *
 * @param state Estado de consentimento a ser salvo.
 * @param opts Opções adicionais para o cookie.
 *
 * @remarks
 * - Seguro para SSR (não executa no servidor).
 * - Usa opções padrão se não especificado.
 */
export function writeConsentCookie(
  state: ConsentState,
  opts?: Partial<ConsentCookieOptions>,
) {
  if (typeof document === 'undefined') return
  const o = { ...DEFAULT_COOKIE_OPTS, ...opts }
  Cookies.set(o.name, JSON.stringify(state), {
    expires: o.maxAgeDays,
    sameSite: o.sameSite,
    secure: o.secure,
    path: o.path,
  })
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
  if (typeof document === 'undefined') return
  const o = { ...DEFAULT_COOKIE_OPTS, ...opts }
  Cookies.remove(o.name, { path: o.path })
}
