import type { Category, CookieDescriptor } from '../types/types'

export const COOKIE_PATTERNS_BY_CATEGORY: Record<Category, string[]> = {
  necessary: ['cookieConsent'],
  analytics: ['_ga', '_ga_*', '_gid', '_gcl_au', '_hj*', 'mp_*', '_clck', '_clsk'],
  functional: ['intercom-*', '__zlcmid', '_zendesk_shared_session', '_userway_*'],
  marketing: ['_fbp', 'fr'],
  social: [],
  personalization: [],
}

export const INTEGRATION_COOKIE_PATTERNS: Record<string, string[]> = {
  'google-analytics': ['_ga', '_ga_*', '_gid'],
  'google-tag-manager': ['_gcl_au'],
  hotjar: [
    '_hjSession_*',
    '_hjSessionUser_*',
    '_hjFirstSeen',
    '_hjIncludedInSessionSample',
    '_hjAbsoluteSessionInProgress',
  ],
  mixpanel: ['mp_*'],
  clarity: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'],
  intercom: ['intercom-id-*', 'intercom-session-*'],
  'zendesk-chat': ['__zlcmid', '_zendesk_shared_session'],
  userway: ['_userway_*'],
  'facebook-pixel': ['_fbp', 'fr'],
}

export const COOKIE_INFO_BY_INTEGRATION: Record<string, CookieDescriptor[]> = {
  'google-analytics': [
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
  'google-tag-manager': [
    {
      name: '_gcl_au',
      purpose: 'Rastreamento de conversões de anúncios',
      duration: '90 dias',
      provider: 'Google',
    },
  ],
  hotjar: [
    {
      name: '_hjSession_*',
      purpose: 'Rastreamento de sessão',
      duration: '30 minutos',
      provider: 'Hotjar',
    },
    {
      name: '_hjSessionUser_*',
      purpose: 'Persistência de usuário entre sessões',
      duration: '365 dias',
      provider: 'Hotjar',
    },
    {
      name: '_hjFirstSeen',
      purpose: 'Detecção da primeira visita do usuário',
      duration: 'Sessão',
      provider: 'Hotjar',
    },
  ],
  mixpanel: [
    {
      name: 'mp_*',
      purpose: 'Rastreamento de eventos e propriedades do usuário para analytics',
      duration: '1 ano',
      provider: 'Mixpanel',
    },
  ],
  clarity: [
    {
      name: '_clck',
      purpose: 'Identificador de usuário',
      duration: '365 dias',
      provider: 'Microsoft',
    },
    { name: '_clsk', purpose: 'Rastreamento de sessão', duration: '1 dia', provider: 'Microsoft' },
  ],
  intercom: [
    {
      name: 'intercom-id-*',
      purpose: 'Identificador do usuário',
      duration: '9 meses',
      provider: 'Intercom',
    },
    {
      name: 'intercom-session-*',
      purpose: 'Gerenciamento de sessão',
      duration: '1 semana',
      provider: 'Intercom',
    },
  ],
  'zendesk-chat': [
    {
      name: '__zlcmid',
      purpose: 'Identificador de sessão de chat',
      duration: '1 ano',
      provider: 'Zendesk',
    },
    {
      name: '_zendesk_shared_session',
      purpose: 'Gerenciamento de sessão',
      duration: 'Sessão',
      provider: 'Zendesk',
    },
  ],
  userway: [
    {
      name: '_userway_*',
      purpose: 'Preferências de acessibilidade',
      duration: '1 ano',
      provider: 'UserWay',
    },
  ],
  'facebook-pixel': [
    { name: '_fbp', purpose: 'Rastreamento de anúncios', duration: '90 dias', provider: 'Meta' },
    { name: 'fr', purpose: 'Direcionamento de anúncios', duration: '90 dias', provider: 'Meta' },
  ],
}

export const INTEGRATION_DEFAULT_CATEGORY: Record<string, Category> = {
  'google-analytics': 'analytics',
  'google-tag-manager': 'analytics',
  hotjar: 'analytics',
  mixpanel: 'analytics',
  clarity: 'analytics',
  intercom: 'functional',
  'zendesk-chat': 'functional',
  userway: 'functional',
  'facebook-pixel': 'marketing',
}

export interface CookieCatalogOverrides {
  byCategory?: Record<string, import('../types/types').CookieDescriptor[]>
  byIntegration?: Record<string, import('../types/types').CookieDescriptor[]>
}

export interface CookieCategoryOverrides {
  [cookieNameOrPattern: string]: Category
}

let COOKIE_CATALOG_OVERRIDES: CookieCatalogOverrides = {}
let COOKIE_CATEGORY_OVERRIDES: CookieCategoryOverrides = {}

export function setCookieCatalogOverrides(overrides: CookieCatalogOverrides) {
  COOKIE_CATALOG_OVERRIDES = {
    byCategory: { ...COOKIE_CATALOG_OVERRIDES.byCategory, ...overrides.byCategory },
    byIntegration: {
      ...COOKIE_CATALOG_OVERRIDES.byIntegration,
      ...overrides.byIntegration,
    },
  }
}

export function setCookieCategoryOverrides(map: CookieCategoryOverrides) {
  COOKIE_CATEGORY_OVERRIDES = { ...COOKIE_CATEGORY_OVERRIDES, ...map }
}

function matchPattern(name: string, pattern: string): boolean {
  if (pattern.endsWith('*')) return name.startsWith(pattern.slice(0, -1))
  return name === pattern
}

export function getCookiesInfoForCategory(
  categoryId: Category,
  usedIntegrations: string[],
): import('../types/types').CookieDescriptor[] {
  const result: import('../types/types').CookieDescriptor[] = []

  usedIntegrations.forEach((id) => {
    const defaultCat = INTEGRATION_DEFAULT_CATEGORY[id]
    const defaults = COOKIE_INFO_BY_INTEGRATION[id] || []
    const list = COOKIE_CATALOG_OVERRIDES.byIntegration?.[id] || defaults
    list.forEach((desc) => {
      const overrideCat = Object.entries(COOKIE_CATEGORY_OVERRIDES).find(([pattern]) =>
        matchPattern(desc.name, pattern),
      )?.[1]
      const finalCat = overrideCat ?? defaultCat
      if (finalCat === categoryId && !result.some((d) => d.name === desc.name)) result.push(desc)
    })
  })

  const catOverride = COOKIE_CATALOG_OVERRIDES.byCategory?.[categoryId]
  if (catOverride) {
    catOverride.forEach((d) => {
      const idx = result.findIndex((x) => x.name === d.name)
      if (idx >= 0) result[idx] = d
      else result.push(d)
    })
  }

  // Garante que a categoria necessária liste o cookie de consentimento
  if (categoryId === 'necessary') {
    if (!result.some((d) => d.name === 'cookieConsent')) {
      result.push({
        name: 'cookieConsent',
        purpose: 'Armazena suas preferências de consentimento',
        duration: '365 dias',
        provider: 'Este site',
      })
    }
  }

  return result
}
