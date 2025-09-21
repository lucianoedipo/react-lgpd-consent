import type { Category } from '../types/types'

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
  hotjar: ['_hjSession_*', '_hjSessionUser_*', '_hjFirstSeen', '_hjIncludedInSessionSample', '_hjAbsoluteSessionInProgress'],
  mixpanel: ['mp_*'],
  clarity: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'],
  intercom: ['intercom-id-*', 'intercom-session-*'],
  'zendesk-chat': ['__zlcmid', '_zendesk_shared_session'],
  userway: ['_userway_*'],
  'facebook-pixel': ['_fbp', 'fr'],
}

