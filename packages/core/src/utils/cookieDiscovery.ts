/**
 * Utilitários para descoberta e categorização de cookies em tempo de execução (experimental).
 *
 * Fornece funções para detectar cookies presentes no navegador, identificar o cookie de consentimento
 * e atribuir cookies descobertos a categorias LGPD usando heurísticas baseadas em padrões conhecidos.
 *
 * @category Utils
 * @since 0.4.1
 * @remarks Funcionalidades experimentais para auxiliar no mapeamento de cookies em conformidade com LGPD.
 *          Recomenda-se uso em desenvolvimento para inspeção manual e merge com catálogo existente.
 */
/* eslint-env browser */
import type { Category, CookieDescriptor } from '../types/types'
import { COOKIE_PATTERNS_BY_CATEGORY, setCookieCatalogOverrides } from './cookieRegistry'

/**
 * Descobre cookies em tempo de execução no navegador (experimental).
 *
 * - Lê `document.cookie` com segurança (SSR-safe)
 * - Retorna lista de cookies detectados (apenas nomes)
 * - Salva em `globalThis.__LGPD_DISCOVERED_COOKIES__` para inspeção/manual merge
 *
 * @category Utils
 * @since 0.4.1
 */
export function discoverRuntimeCookies(): CookieDescriptor[] {
  const currentDocument = globalThis.document
  if (!currentDocument?.cookie) return []

  const names = Array.from(
    new Set(
      currentDocument.cookie
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.split('=')[0]),
    ),
  )
  const list: CookieDescriptor[] = names.map((name) => ({ name }))
  try {
    ;(
      globalThis as unknown as { __LGPD_DISCOVERED_COOKIES__?: CookieDescriptor[] }
    ).__LGPD_DISCOVERED_COOKIES__ = list
  } catch {
    // ignore
  }

  return list
}

/**
 * Tenta detectar o nome do cookie de consentimento pela estrutura JSON armazenada.
 * Retorna o nome se for encontrado, caso contrário `null`.
 * @category Utils
 * @since 0.4.1
 */

function tryDecode(val: string): string {
  try {
    return decodeURIComponent(val)
  } catch {
    return val
  }
}

function isConsentJson(val: string): boolean {
  if (!val.startsWith('{')) return false
  try {
    const obj = JSON.parse(val)
    return obj && typeof obj === 'object' && 'preferences' in obj && 'version' in obj
  } catch {
    return false
  }
}

/**
 * Tenta detectar o nome do cookie de consentimento LGPD presente no navegador.
 *
 * - Percorre todos os cookies disponíveis em `document.cookie`.
 * - Decodifica o valor e verifica se corresponde à estrutura JSON esperada de consentimento.
 * - Retorna o nome do cookie se encontrado, ou `null` se não houver nenhum compatível.
 *
 * @returns Nome do cookie de consentimento ou `null` se não encontrado
 * @category Utils
 * @since 0.4.1
 * @example
 * ```ts
 * const consentCookie = detectConsentCookieName()
 * if (consentCookie) {
 *   console.log('Cookie de consentimento encontrado:', consentCookie)
 * }
 * ```
 * @remarks SSR-safe: retorna `null` se executado fora do browser.
 */

export function detectConsentCookieName(): string | null {
  const currentDocument = globalThis.document
  if (!currentDocument?.cookie) return null

  try {
    const pairs = currentDocument.cookie
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
    for (const p of pairs) {
      const [name, ...rest] = p.split('=')
      const raw = rest.join('=')
      if (!raw) continue
      const val = tryDecode(raw)
      if (isConsentJson(val)) {
        return name
      }
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Função auxiliar para match de padrões
 * @internal
 */
function matchPattern(name: string, pattern: string): boolean {
  if (pattern.endsWith('*')) return name.startsWith(pattern.slice(0, -1))
  return name === pattern
}

/**
 * Heurística simples para atribuir cookies descobertos a categorias LGPD (experimental).
 *
 * - Usa padrões conhecidos por categoria
 * - Ignora `cookieConsent` (já tratado como necessary)
 * - Pode opcionalmente registrar overrides de catálogo por categoria
 *
 * @param discovered Lista de cookies descobertos (opcional: usa global se ausente)
 * @param registerOverrides Se `true`, registra em `setCookieCatalogOverrides`
 * @returns Mapa categoria -> descritores atribuídos
 * @category Utils
 * @since 0.4.1
 */
export function categorizeDiscoveredCookies(
  discovered?: CookieDescriptor[],
  registerOverrides: boolean = false,
): Record<Category, CookieDescriptor[]> {
  const list =
    discovered ||
    (globalThis as unknown as { __LGPD_DISCOVERED_COOKIES__?: CookieDescriptor[] })
      .__LGPD_DISCOVERED_COOKIES__ ||
    []

  const out: Record<string, CookieDescriptor[]> = {}

  list
    .filter((d) => d.name && d.name !== 'cookieConsent')
    .forEach((d) => {
      let assigned: Category | null = null
      ;(Object.keys(COOKIE_PATTERNS_BY_CATEGORY) as Category[]).forEach((cat) => {
        if (assigned) return
        const patterns = COOKIE_PATTERNS_BY_CATEGORY[cat] || []
        if (patterns.some((p) => matchPattern(d.name, p))) assigned = cat
      })
      const cat: Category = (assigned ?? 'analytics') as Category
      out[cat] = out[cat] || []
      if (!out[cat].some((x) => x.name === d.name)) out[cat].push(d)
    })

  if (registerOverrides) {
    const byCategory: Record<string, CookieDescriptor[]> = {}
    Object.entries(out).forEach(([cat, cookies]) => {
      byCategory[cat] = cookies
    })
    setCookieCatalogOverrides({ byCategory })
  }

  return out as Record<Category, CookieDescriptor[]>
}
