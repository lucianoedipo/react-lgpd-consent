import Cookies from 'js-cookie'
import {
  readConsentCookie,
  writeConsentCookie,
  removeConsentCookie,
  createInitialConsentState,
  buildConsentStorageKey,
  createConsentAuditEntry,
} from './cookieUtils'
import type { ConsentState } from '../types/types'

jest.mock('js-cookie')

// console.* é suprimido globalmente em jest.setup.ts

describe('cookieUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // ensure document exists in jsdom env
    globalThis.document = global.document
  })

  it('createInitialConsentState returns a valid default state', () => {
    const s = createInitialConsentState()
    expect(s).toHaveProperty('version')
    expect(s.consented).toBe(false)
    expect(s.preferences).toHaveProperty('necessary')
  })

  it('readConsentCookie returns null when cookie missing', () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(undefined)
    const out = readConsentCookie('cookieConsent')
    expect(out).toBeNull()
  })

  it('readConsentCookie parses valid cookie', () => {
    const sample: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }
    ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(sample))
    const out = readConsentCookie('cookieConsent')
    expect(out).toBeTruthy()
    expect(out?.consented).toBe(true)
    expect(out?.preferences.analytics).toBe(true)
  })

  it('writeConsentCookie calls Cookies.set with proper args', () => {
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: false },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }
    const config = { enabledCategories: ['analytics'] } as any

    writeConsentCookie(state, config, { name: 'cookieConsent', maxAgeDays: 7 }, 'modal')

    expect(Cookies.set).toHaveBeenCalled()
    const [name, value, opts] = (Cookies.set as jest.Mock).mock.calls[0]
    expect(name).toBe('cookieConsent')
    expect(typeof value).toBe('string')
    const parsed = JSON.parse(value)
    expect(parsed.consentDate).toBeDefined()
    expect(opts).toHaveProperty('expires', 7)
  })

  it('removeConsentCookie calls Cookies.remove with default path', () => {
    removeConsentCookie()
    expect(Cookies.remove).toHaveBeenCalledWith(
      'cookieConsent',
      expect.objectContaining({ path: '/' }),
    )
  })

  it('removeConsentCookie aplica domínio customizado quando fornecido', () => {
    ;(Cookies.remove as jest.Mock).mockClear()
    removeConsentCookie({ domain: '.example.com' })
    expect(Cookies.remove).toHaveBeenCalledWith('cookieConsent', {
      path: '/',
      domain: '.example.com',
    })
  })

  it('readConsentCookie migrates legacy cookie without version', () => {
    const legacy = {
      consented: true,
      preferences: { necessary: true },
      consentDate: new Date().toISOString(),
    }
    ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(legacy))

    const out = readConsentCookie('cookieConsent')
    expect(out).toBeTruthy()
    // migration should add version and normalize fields
    expect(out).toHaveProperty('version', '1.0')
    expect(out?.consented).toBe(true)
  })

  it('readConsentCookie returns null on invalid JSON', () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('not-a-json')
    const out = readConsentCookie('cookieConsent')
    expect(out).toBeNull()
  })

  it('readConsentCookie returns null on schema version mismatch', () => {
    const sample = {
      version: '0.9',
      consented: true,
      preferences: { necessary: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }
    ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(sample))
    const out = readConsentCookie('cookieConsent')
    expect(out).toBeNull()
  })

  it('writeConsentCookie força necessary=true antes de persistir', () => {
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: false, analytics: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }
    const config = { enabledCategories: ['analytics'] } as any

    writeConsentCookie(state, config)

    const [, value] = (Cookies.set as jest.Mock).mock.calls.pop()
    const parsed = JSON.parse(value)
    expect(parsed.preferences.necessary).toBe(true)
  })

  it('writeConsentCookie forwards domain option when provided', () => {
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }
    const config = { enabledCategories: ['analytics'] } as any

    writeConsentCookie(state, config, { name: 'foo', domain: '.example.com' })

    const [, , opts] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(opts).toMatchObject({ domain: '.example.com', path: '/' })
  })

  it('buildConsentStorageKey normaliza namespace e versão', () => {
    expect(buildConsentStorageKey({ namespace: 'Portal.GOV', version: '2025 Q4' })).toBe(
      'portal.gov__v2025-q4',
    )
    expect(buildConsentStorageKey()).toBe('lgpd-consent__v1')
  })

  it('createConsentAuditEntry gera payload completo com consentVersion', () => {
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true },
      consentDate: '2024-01-15T10:30:00.000Z',
      lastUpdate: '2024-01-16T08:00:00.000Z',
      source: 'modal',
      projectConfig: { enabledCategories: ['analytics'] },
      isModalOpen: false,
    }

    const audit = createConsentAuditEntry(state, {
      storageKey: 'portal__v2',
      action: 'update',
      consentVersion: '2025-Q4',
      origin: 'modal',
    })

    expect(audit).toMatchObject({
      action: 'update',
      storageKey: 'portal__v2',
      consentVersion: '2025-Q4',
      consented: true,
      source: 'modal',
      version: '1.0',
      projectConfig: { enabledCategories: ['analytics'] },
    })
    expect(audit.timestamp).toBeTruthy()
    expect(audit.preferences).toHaveProperty('necessary', true)
  })

  // SSR-specific branches are environment-dependent and flaky under jsdom
  // so they are intentionally not asserted here. The important logic
  // (migration, parsing, version) is covered above.
})
