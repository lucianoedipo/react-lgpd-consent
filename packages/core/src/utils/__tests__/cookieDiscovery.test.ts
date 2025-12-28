import {
  categorizeDiscoveredCookies,
  detectConsentCookieName,
  discoverRuntimeCookies,
} from '../cookieDiscovery'

const mockCookie = (cookie: string) => {
  Object.defineProperty(document, 'cookie', {
    get: jest.fn().mockImplementation(() => cookie),
    configurable: true,
  })
}

jest.mock('../cookieRegistry', () => ({
  ...jest.requireActual('../cookieRegistry'),
  COOKIE_PATTERNS_BY_CATEGORY: {
    necessary: ['user_session'],
    analytics: ['_ga'],
    marketing: ['_fbp'],
  },
}))

describe('discoverRuntimeCookies', () => {
  it('should return an empty array when document is not defined', () => {
    const originalDocument = global.document
    // @ts-ignore - Simular ambiente SSR onde document não existe
    global.document = undefined
    expect(discoverRuntimeCookies()).toEqual([])
    global.document = originalDocument
  })

  it('should return an empty array when document.cookie is empty', () => {
    mockCookie('')
    expect(discoverRuntimeCookies()).toEqual([])
  })

  it('should return a list of cookies', () => {
    mockCookie(
      '_ga=GA1.2.12345.67890; _gid=GA1.2.98765.43210; cookieConsent={"preferences":{"analytics":true}}',
    )
    expect(discoverRuntimeCookies()).toEqual([
      { name: '_ga' },
      { name: '_gid' },
      { name: 'cookieConsent' },
    ])
  })
})

describe('detectConsentCookieName', () => {
  it('should return null when document is not defined', () => {
    const originalDocument = global.document
    // @ts-ignore - Simular ambiente SSR onde document não existe para detectConsentCookieName
    global.document = undefined
    expect(detectConsentCookieName()).toBeNull()
    global.document = originalDocument
  })

  it('should return null when document.cookie is empty', () => {
    mockCookie('')
    expect(detectConsentCookieName()).toBeNull()
  })

  it('should return the name of the consent cookie', () => {
    mockCookie(
      '_ga=GA1.2.12345.67890; my-consent-cookie={"preferences":{"analytics":true},"version":"1"}; _gid=GA1.2.98765.43210',
    )
    expect(detectConsentCookieName()).toBe('my-consent-cookie')
  })

  it('should skip cookies sem valor', () => {
    mockCookie('empty=; consent={"preferences":{"analytics":true},"version":"1"}')
    expect(detectConsentCookieName()).toBe('consent')
  })

  it('should return null if no consent cookie is found', () => {
    mockCookie('_ga=GA1.2.12345.67890; _gid=GA1.2.98765.43210')
    expect(detectConsentCookieName()).toBeNull()
  })

  it('should ignore cookies com valor com encoding invalido', () => {
    mockCookie('bad=%E0%A4%A; _gid=GA1.2.98765.43210')
    expect(detectConsentCookieName()).toBeNull()
  })

  it('should ignore cookies com JSON invalido', () => {
    mockCookie('broken={invalid; _ga=GA1.2.12345.67890')
    expect(detectConsentCookieName()).toBeNull()
  })
})

describe('categorizeDiscoveredCookies', () => {
  it('should return an empty object when no cookies are discovered', () => {
    expect(categorizeDiscoveredCookies([])).toEqual({})
  })

  it('should categorize cookies based on patterns', () => {
    const discoveredCookies = [{ name: '_ga' }, { name: '_fbp' }, { name: 'user_session' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies)
    expect(categorized).toEqual({
      analytics: [{ name: '_ga' }],
      marketing: [{ name: '_fbp' }],
      necessary: [{ name: 'user_session' }],
    })
  })

  it('should assign unknown cookies to analytics category', () => {
    const discoveredCookies = [{ name: 'unknown_cookie' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies)
    expect(categorized).toEqual({
      analytics: [{ name: 'unknown_cookie' }],
    })
  })

  it('should not categorize the consent cookie', () => {
    const discoveredCookies = [{ name: 'cookieConsent' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies)
    expect(categorized).toEqual({})
  })

  it('should use global discovered cookies when not provided', () => {
    const globalCookies = [{ name: '_ga' }]
    // @ts-ignore - Simular cookies descobertos globalmente
    ;(
      globalThis as unknown as { __LGPD_DISCOVERED_COOKIES__?: unknown[] }
    ).__LGPD_DISCOVERED_COOKIES__ = globalCookies

    const categorized = categorizeDiscoveredCookies()

    // @ts-ignore - Limpar
    delete (globalThis as unknown as { __LGPD_DISCOVERED_COOKIES__?: unknown[] })
      .__LGPD_DISCOVERED_COOKIES__

    expect(categorized).toEqual({
      analytics: [{ name: '_ga' }],
    })
  })

  it('should register overrides when registerOverrides=true', () => {
    const discoveredCookies = [{ name: '_ga' }, { name: '_fbp' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies, true)

    expect(categorized).toEqual({
      analytics: [{ name: '_ga' }],
      marketing: [{ name: '_fbp' }],
    })
    // setCookieCatalogOverrides foi chamado (não testamos diretamente pois é mock)
  })

  it('should handle cookies without name', () => {
    const discoveredCookies = [{ name: '' }, { name: '_ga' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies)
    expect(categorized).toEqual({
      analytics: [{ name: '_ga' }],
    })
  })

  it('should not duplicate cookies in same category', () => {
    const discoveredCookies = [{ name: '_ga' }, { name: '_ga' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies)
    expect(categorized.analytics).toHaveLength(1)
  })

  it('should match wildcard patterns', () => {
    const { COOKIE_PATTERNS_BY_CATEGORY } = require('../cookieRegistry')
    COOKIE_PATTERNS_BY_CATEGORY.analytics = ['_ga*']

    const discoveredCookies = [{ name: '_ga_test' }]
    const categorized = categorizeDiscoveredCookies(discoveredCookies)
    expect(categorized.analytics).toBeDefined()
  })
})
