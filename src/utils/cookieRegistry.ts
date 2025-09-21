import type { Category, CookieDescriptor } from '../types/types'

export const COOKIE_PATTERNS_BY_CATEGORY: Record<Category, string[]> = {
  necessary: [],
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
    { name: '_ga', purpose: 'Visitor tracking (GA4)', duration: '2 years', provider: 'Google' },
    {
      name: '_ga_*',
      purpose: 'Session/stream tracking (GA4)',
      duration: '2 years',
      provider: 'Google',
    },
    {
      name: '_gid',
      purpose: 'Daily visitor tracking (GA4)',
      duration: '24 hours',
      provider: 'Google',
    },
  ],
  'google-tag-manager': [
    { name: '_gcl_au', purpose: 'Ad conversion tracking', duration: '90 days', provider: 'Google' },
  ],
  hotjar: [
    {
      name: '_hjSession_*',
      purpose: 'Session tracking',
      duration: '30 minutes',
      provider: 'Hotjar',
    },
    {
      name: '_hjSessionUser_*',
      purpose: 'User session persistence',
      duration: '365 days',
      provider: 'Hotjar',
    },
    {
      name: '_hjFirstSeen',
      purpose: 'First visit detection',
      duration: 'Session',
      provider: 'Hotjar',
    },
  ],
  mixpanel: [
    { name: 'mp_*', purpose: 'Event analytics tracking', duration: '1 year', provider: 'Mixpanel' },
  ],
  clarity: [
    { name: '_clck', purpose: 'User identifier', duration: '365 days', provider: 'Microsoft' },
    { name: '_clsk', purpose: 'Session tracking', duration: '1 day', provider: 'Microsoft' },
  ],
  intercom: [
    {
      name: 'intercom-id-*',
      purpose: 'User identifier',
      duration: '9 months',
      provider: 'Intercom',
    },
    {
      name: 'intercom-session-*',
      purpose: 'Session management',
      duration: '1 week',
      provider: 'Intercom',
    },
  ],
  'zendesk-chat': [
    {
      name: '__zlcmid',
      purpose: 'Chat session identifier',
      duration: '1 year',
      provider: 'Zendesk',
    },
    {
      name: '_zendesk_shared_session',
      purpose: 'Session management',
      duration: 'Session',
      provider: 'Zendesk',
    },
  ],
  userway: [
    {
      name: '_userway_*',
      purpose: 'Accessibility preferences',
      duration: '1 year',
      provider: 'UserWay',
    },
  ],
  'facebook-pixel': [
    { name: '_fbp', purpose: 'Ad tracking', duration: '90 days', provider: 'Meta' },
    { name: 'fr', purpose: 'Ad targeting', duration: '90 days', provider: 'Meta' },
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
    byCategory: { ...(COOKIE_CATALOG_OVERRIDES.byCategory || {}), ...(overrides.byCategory || {}) },
    byIntegration: {
      ...(COOKIE_CATALOG_OVERRIDES.byIntegration || {}),
      ...(overrides.byIntegration || {}),
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
    const defaults =
      (COOKIE_INFO_BY_INTEGRATION as Record<string, import('../types/types').CookieDescriptor[]>)[
        id
      ] || []
    const list = COOKIE_CATALOG_OVERRIDES.byIntegration?.[id] || defaults
    list.forEach((desc) => {
      const overrideCat = Object.entries(COOKIE_CATEGORY_OVERRIDES).find(([pattern]) =>
        matchPattern(desc.name, pattern),
      )?.[1]
      const finalCat = overrideCat ?? defaultCat
      if (finalCat === categoryId && !result.find((d) => d.name === desc.name)) result.push(desc)
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

  return result
}
