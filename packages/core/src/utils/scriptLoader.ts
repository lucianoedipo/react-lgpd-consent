/** @module src/utils/scriptLoader */
/**
 * @category Utils
 * @since 0.1.0
 * Utilitários para carregamento dinâmico e seguro de scripts externos no DOM.
 *
 * Fornece funções para carregar scripts de terceiros de forma condicional ao consentimento LGPD,
 * garantindo compatibilidade SSR e verificações de permissões por categoria.
 */

import type { ConsentPreferences } from '../types/types'

// Global registry para prevenir injeções duplicadas (React 19 StrictMode)
const LOADING_SCRIPTS = new Map<string, Promise<void>>()

type ConsentSnapshot = {
  consented: boolean
  preferences: ConsentPreferences
  isModalOpen?: boolean
}

export interface LoadScriptOptions {
  consentSnapshot?: ConsentSnapshot
  cookieName?: string
  pollIntervalMs?: number
  skipConsentCheck?: boolean
}

const DEFAULT_POLL_INTERVAL = 100

function resolveCookieNames(preferred?: string): string[] {
  const inferred =
    (globalThis as unknown as { __LGPD_CONSENT_COOKIE__?: string }).__LGPD_CONSENT_COOKIE__ ?? null
  const names = [preferred, inferred, 'cookieConsent', 'lgpd-consent__v1'].filter(
    Boolean,
  ) as string[]
  return Array.from(new Set(names))
}

function parseConsentFromCookie(names: string[]): ConsentSnapshot | null {
  const raw = document.cookie
  if (!raw) return null

  const cookies = raw.split('; ').reduce<Record<string, string>>((acc, part) => {
    const [k, ...rest] = part.split('=')
    acc[k] = rest.join('=')
    return acc
  }, {})

  for (const name of names) {
    const value = cookies[name]
    if (!value) continue
    try {
      const parsed = JSON.parse(decodeURIComponent(value)) as ConsentSnapshot
      if (!parsed.consented || parsed.isModalOpen) continue
      return parsed
    } catch {
      continue
    }
  }

  return null
}

function hasCategoryConsent(snapshot: ConsentSnapshot, category: string | null): boolean {
  if (!snapshot.consented || snapshot.isModalOpen) return false
  if (category === null) return true
  return Boolean(snapshot.preferences?.[category])
}

/**
 * @function
 * @category Utils
 * @since 0.1.0
 * Carrega dinamicamente um script externo no DOM.
 *
 * @remarks
 * Esta função é utilizada internamente pela biblioteca para carregar scripts de integração
 * após o consentimento do usuário. Ela garante que o script só seja inserido na página
 * se o consentimento for dado e o contexto estiver disponível.
 *
 * **React 19 StrictMode**: A função é idempotente e mantém um registro global de scripts
 * em carregamento para evitar duplicações durante double-invoking de efeitos em desenvolvimento.
 *
 * @param {string} id Um identificador único para o elemento `<script>` a ser criado.
 * @param {string} src A URL do script externo a ser carregado.
 * @param {string | null} [category=null] A categoria de consentimento exigida para o script. Suporta tanto categorias predefinidas quanto customizadas. Se o consentimento para esta categoria não for dado, o script não será carregado.
 * @param {Record<string, string>} [attrs={}] Atributos adicionais a serem aplicados ao elemento `<script>` (ex: `{ async: 'true' }`).
 * @param {string | undefined} [nonce] Nonce CSP opcional aplicado ao script.
 * @param {LoadScriptOptions} [options] Configurações avançadas (consentSnapshot, cookieName, pollIntervalMs, skipConsentCheck).
 * @returns {Promise<void>} Uma Promise que resolve quando o script é carregado com sucesso, ou rejeita se o consentimento não for dado ou ocorrer um erro de carregamento.
 * @example
 * ```ts
 * // Carregar um script de analytics após o consentimento
 * loadScript('my-analytics-script', 'https://example.com/analytics.js', 'analytics')
 *   .then(() => console.log('Script de analytics carregado!'))
 *   .catch(error => console.error('Erro ao carregar script:', error))
 * ```
 */
export function loadScript(
  id: string,
  src: string,
  category: string | null = null,
  attrs: Record<string, string> = {},
  nonce?: string,
  options?: LoadScriptOptions,
) {
  if (!src) return Promise.resolve()
  if (typeof document === 'undefined') return Promise.resolve()

  // Se script já existe no DOM, resolve imediatamente
  if (document.getElementById(id)) return Promise.resolve()

  // Se já está sendo carregado, retorna a Promise existente (previne duplicação)
  const existingPromise = LOADING_SCRIPTS.get(id)
  if (existingPromise) return existingPromise

  const pollInterval = options?.pollIntervalMs ?? DEFAULT_POLL_INTERVAL
  const names = resolveCookieNames(options?.cookieName)
  const mergedAttrs = { ...attrs }

  const promise = new Promise<void>((resolve, reject) => {
    const inject = () => {
      const s = document.createElement('script')
      s.id = id
      s.src = src
      s.async = mergedAttrs.async !== 'false'
      const scriptNonce = mergedAttrs.nonce || nonce
      if (scriptNonce) {
        s.nonce = scriptNonce
        mergedAttrs.nonce = scriptNonce
      }
      for (const [k, v] of Object.entries(mergedAttrs)) s.setAttribute(k, v)

      s.onload = () => {
        LOADING_SCRIPTS.delete(id)
        resolve()
      }
      s.onerror = () => {
        LOADING_SCRIPTS.delete(id)
        reject(new Error(`Failed to load script: ${src}`))
      }

      document.body.appendChild(s)
    }

    const snapshot = options?.consentSnapshot
    const skipChecks = options?.skipConsentCheck === true

    if (skipChecks) {
      inject()
      return
    }

    if (snapshot) {
      if (!hasCategoryConsent(snapshot, category)) {
        reject(
          new Error(
            `Consent not granted for category '${category ?? 'none'}' when attempting to load ${id}`,
          ),
        )
        return
      }
      inject()
      return
    }

    const checkConsent = () => {
      const consent = parseConsentFromCookie(names)
      if (!consent) {
        setTimeout(checkConsent, pollInterval)
        return
      }

      if (!hasCategoryConsent(consent, category)) {
        setTimeout(checkConsent, pollInterval)
        return
      }

      inject()
    }

    checkConsent()
  })

  LOADING_SCRIPTS.set(id, promise)
  return promise
}
