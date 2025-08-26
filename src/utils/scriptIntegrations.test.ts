import {
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createUserWayIntegration,
} from './scriptIntegrations'

// Suprimir logs do developerGuidance durante estes testes
let __logSpy: jest.SpyInstance, __infoSpy: jest.SpyInstance, __groupSpy: jest.SpyInstance, __warnSpy: jest.SpyInstance, __errorSpy: jest.SpyInstance

beforeAll(() => {
  __logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  __infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
  __groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
  __warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  __errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  __logSpy.mockRestore()
  __infoSpy.mockRestore()
  __groupSpy.mockRestore()
  __warnSpy.mockRestore()
  __errorSpy.mockRestore()
})

describe('scriptIntegrations factories', () => {
  beforeEach(() => {
    // reset global window properties used by integrations
    // @ts-ignore
    delete (global as any).window
    ;(global as any).window = {}
  })

  test('google analytics integration sets window.gtag and dataLayer', () => {
    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
    expect(ga.id).toBe('google-analytics')
    expect(ga.category).toBe('analytics')

    // call init and assert side effects
    ga.init && ga.init()
    // @ts-ignore
    expect((global as any).window.dataLayer).toBeDefined()
    // @ts-ignore
    expect(typeof (global as any).window.gtag).toBe('function')
  })

  test('google tag manager integration pushes to dataLayer', () => {
    const gtm = createGoogleTagManagerIntegration({ containerId: 'GTM-ABC' })
    expect(gtm.id).toBe('google-tag-manager')
    expect(gtm.category).toBe('analytics')

    gtm.init && gtm.init()
    // @ts-ignore
    expect((global as any).window.dataLayer).toBeDefined()
    // @ts-ignore
    expect((global as any).window.dataLayer.length).toBeGreaterThanOrEqual(1)
  })

  test('userway integration sets UserWayWidgetApp and attrs', () => {
    const userway = createUserWayIntegration({ accountId: 'acct-123' })
    expect(userway.id).toBe('userway')
    expect(userway.category).toBe('functional')

    userway.init && userway.init()
    // @ts-ignore
    expect((global as any).window.UserWayWidgetApp).toBeDefined()
    // @ts-ignore
    expect((global as any).window.UserWayWidgetApp.accountId).toBe('acct-123')
    expect(userway.attrs).toMatchObject({ 'data-account': 'acct-123' })
  })
})
