import Cookies from 'js-cookie'
import type { ConsentState } from '../../types/types'
import {
  __resolveCookieOptionsForTests,
  buildConsentStorageKey,
  createConsentAuditEntry,
  createInitialConsentState,
  readConsentCookie,
  removeConsentCookie,
  writeConsentCookie,
} from '../cookieUtils'

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
    expect(out?.preferences.necessary).toBe(true)
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

    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00.000Z'))

    writeConsentCookie(state, config, { name: 'cookieConsent', maxAge: 60 }, 'modal')

    expect(Cookies.set).toHaveBeenCalled()
    const [name, value, opts] = (Cookies.set as jest.Mock).mock.calls[0]
    expect(name).toBe('cookieConsent')
    expect(typeof value).toBe('string')
    const parsed = JSON.parse(value)
    expect(parsed.consentDate).toBeDefined()
    expect(opts.expires).toBeInstanceOf(Date)
    expect((opts.expires as Date).toISOString()).toBe('2024-01-01T00:01:00.000Z')
    jest.useRealTimers()
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

  it('readConsentCookie retorna null quando migracao legada falha', () => {
    const originalDate = globalThis.Date
    // @ts-ignore
    globalThis.Date = class extends Date {
      constructor(...args: ConstructorParameters<typeof Date>) {
        super(...args)
        throw new Error('fail')
      }
    }

    ;(Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ consented: true, preferences: { necessary: true } }),
    )

    const out = readConsentCookie('cookieConsent')
    expect(out).toBeNull()

    globalThis.Date = originalDate
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

    writeConsentCookie(state, config, { name: 'foo', domain: '.example.com', maxAge: 120 })

    const [, , opts] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(opts).toMatchObject({ domain: '.example.com', path: '/' })
  })

  it('writeConsentCookie respeita SameSite customizado', () => {
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }

    writeConsentCookie(state, { enabledCategories: ['analytics'] } as any, {
      sameSite: 'None',
      secure: true,
    })

    const [, , opts] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(opts.sameSite).toBe('None')
    expect(opts.secure).toBe(true)
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

  it('writeConsentCookie uses default options when not provided', () => {
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }

    writeConsentCookie(state, { enabledCategories: [] } as any)

    expect(Cookies.set).toHaveBeenCalled()
    const [name] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(name).toBe('cookieConsent')
  })

  it('writeConsentCookie aplica secure true automaticamente em HTTPS', () => {
    const originalForce = (globalThis as any).__LGPD_FORCE_HTTPS__
    ;(globalThis as any).__LGPD_FORCE_HTTPS__ = true

    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }

    writeConsentCookie(state, { enabledCategories: [] } as any)

    const [, , opts] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(opts.secure).toBe(true)
    ;(globalThis as any).__LGPD_FORCE_HTTPS__ = originalForce
  })

  it('writeConsentCookie respeita secure=false mesmo com force HTTPS', () => {
    const originalForce = (globalThis as any).__LGPD_FORCE_HTTPS__
    ;(globalThis as any).__LGPD_FORCE_HTTPS__ = true

    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true, analytics: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }

    writeConsentCookie(state, { enabledCategories: ['analytics'] } as any, { secure: false })
    const [, , opts] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(opts.secure).toBe(false)
    ;(globalThis as any).__LGPD_FORCE_HTTPS__ = originalForce
  })

  it('writeConsentCookie converte maxAgeDays para expires em segundos', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }

    writeConsentCookie(state, { enabledCategories: [] } as any, { maxAgeDays: 1 })

    const [, , opts] = (Cookies.set as jest.Mock).mock.calls.pop()
    expect(opts.expires).toBeInstanceOf(Date)
    expect((opts.expires as Date).toISOString()).toBe('2024-01-02T00:00:00.000Z')
    jest.useRealTimers()
  })

  it('writeConsentCookie não escreve em SSR', () => {
    const originalDocument = globalThis.document
    const originalWindow = globalThis.window
    const originalSsrFlag = (globalThis as any).__LGPD_SSR__
    ;(globalThis as any).__LGPD_SSR__ = true
    const state: ConsentState = {
      version: '1.0',
      consented: true,
      preferences: { necessary: true },
      consentDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      source: 'banner',
      isModalOpen: false,
    }

    writeConsentCookie(state, { enabledCategories: [] } as any)
    expect(Cookies.set).not.toHaveBeenCalled()
    ;(globalThis as any).__LGPD_SSR__ = originalSsrFlag
    globalThis.window = originalWindow
    globalThis.document = originalDocument
  })

  describe('resolveCookieOptions (interno)', () => {
    it('normaliza valores negativos de expiração e mantém name customizado', () => {
      const resolved = __resolveCookieOptionsForTests({
        maxAge: -10,
        maxAgeDays: -2,
        name: 'custom',
      })
      expect(resolved.name).toBe('custom')
      expect(resolved.maxAge).toBe(0)
      expect(resolved.path).toBe('/')
    })

    it('usa defaults seguros quando não há protocolo disponível', () => {
      const originalWindow = globalThis.window
      const originalLocation = globalThis.location
      ;(globalThis as any).window = { location: undefined }
      ;(globalThis as any).location = undefined

      const resolved = __resolveCookieOptionsForTests({})
      expect(resolved.secure).toBe(false)
      expect(resolved.sameSite).toBe('Lax')
      expect(resolved.domain).toBeUndefined()
      ;(globalThis as any).window = originalWindow
      ;(globalThis as any).location = originalLocation
    })
  })

  describe('edge cases', () => {
    it('readConsentCookie handles malformed JSON gracefully', () => {
      ;(Cookies.get as jest.Mock).mockReturnValue('{invalid-json')
      const out = readConsentCookie('cookieConsent')
      expect(out).toBeNull()
    })

    it('readConsentCookie handles empty object cookie with migration', () => {
      ;(Cookies.get as jest.Mock).mockReturnValue('{}')
      const out = readConsentCookie('cookieConsent')
      // Migração cria um objeto válido mesmo de {}
      expect(out).toBeTruthy()
      expect(out?.version).toBe('1.0')
    })

    it('buildConsentStorageKey handles special characters', () => {
      const key = buildConsentStorageKey({ namespace: 'Test App!', version: '1.0.0' })
      expect(key).toBe('test-app-__v1.0.0')
    })

    it('createConsentAuditEntry handles minimal state', () => {
      const state: ConsentState = {
        version: '1.0',
        consented: false,
        preferences: { necessary: true },
        consentDate: '',
        lastUpdate: '',
        source: 'banner',
        isModalOpen: false,
      }

      const audit = createConsentAuditEntry(state, {
        storageKey: 'test',
        action: 'init',
        origin: 'banner',
      })

      expect(audit.action).toBe('init')
      expect(audit.consented).toBe(false)
    })

    it('removeConsentCookie uses custom name when provided', () => {
      ;(Cookies.remove as jest.Mock).mockClear()
      removeConsentCookie({ name: 'custom-consent' })
      expect(Cookies.remove).toHaveBeenCalledWith(
        'custom-consent',
        expect.objectContaining({ path: '/' }),
      )
    })

    it('readConsentCookie retorna null para cookie vazio', () => {
      ;(Cookies.get as jest.Mock).mockReturnValue('')
      const out = readConsentCookie('cookieConsent')
      expect(out).toBeNull()
    })

    it('readConsentCookie retorna null quando payload não é objeto', () => {
      ;(Cookies.get as jest.Mock).mockReturnValue('42')
      const out = readConsentCookie('cookieConsent')
      expect(out).toBeNull()
    })

    it('readConsentCookie aplica fallback de preferences quando ausente', () => {
      const payload = {
        version: '1.0',
        consented: true,
        consentDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        source: 'banner',
        isModalOpen: false,
      }
      ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(payload))
      const out = readConsentCookie('cookieConsent')
      expect(out?.preferences.necessary).toBe(true)
    })

    it('readConsentCookie força necessary=true mesmo se salvo como false', () => {
      const payload = {
        version: '1.0',
        consented: true,
        preferences: { necessary: false, analytics: true },
        consentDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        source: 'banner',
        isModalOpen: false,
      }
      ;(Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(payload))
      const out = readConsentCookie('cookieConsent')
      expect(out?.preferences.necessary).toBe(true)
    })
  })
})
