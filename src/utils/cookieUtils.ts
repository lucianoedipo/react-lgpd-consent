import Cookies from 'js-cookie'
import type { ConsentCookieOptions, ConsentState } from '../types/types'

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

export function readConsentCookie<T = ConsentState>(
  name: string = DEFAULT_COOKIE_OPTS.name,
): T | null {
  // SSR-safe: Cookies só existe no client
  if (typeof document === 'undefined') return null
  const raw = Cookies.get(name)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

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

export function removeConsentCookie(opts?: Partial<ConsentCookieOptions>) {
  if (typeof document === 'undefined') return
  const o = { ...DEFAULT_COOKIE_OPTS, ...opts }
  Cookies.remove(o.name, { path: o.path })
}
