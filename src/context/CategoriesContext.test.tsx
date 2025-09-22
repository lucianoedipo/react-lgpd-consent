import { render, screen, act } from '@testing-library/react'
import { CategoriesProvider, useCategories, useCategoryStatus } from './CategoriesContext'
import * as cookieDiscovery from '../utils/cookieDiscovery'

// Mocking developerGuidance functions to avoid console logs in tests
jest.mock('../utils/developerGuidance', () => ({
  ...jest.requireActual('../utils/developerGuidance'),
  analyzeDeveloperConfiguration: jest.fn(() => ({
    warnings: [],
    suggestions: [],
    activeCategoriesInfo: [],
    usingDefaults: false,
  })),
  logDeveloperGuidance: jest.fn(),
}))

function CategoriesConsumer() {
  const categories = useCategories()
  return <div data-testid="categories">{JSON.stringify(categories)}</div>
}

function CategoryStatusConsumer({ category }: { readonly category: string }) {
  const status = useCategoryStatus(category)
  return <div data-testid={`status-${category}`}>{JSON.stringify(status)}</div>
}

describe('CategoriesContext', () => {
  const originalNodeEnv = process.env.NODE_ENV

  beforeEach(() => {
    // @ts-ignore
    global.process.env.NODE_ENV = 'development'
    // @ts-ignore
    delete global.__LGPD_DISCOVERY_LOGGED__
  })

  afterEach(() => {
    jest.clearAllMocks()
    // @ts-ignore
    global.process.env.NODE_ENV = originalNodeEnv
  })

  test('provides categories shape', () => {
    render(
      <CategoriesProvider>
        <CategoriesConsumer />
      </CategoriesProvider>,
    )

    expect(screen.getByTestId('categories').textContent).toContain('allCategories')
  })

  test('useCategoryStatus returns expected keys', () => {
    render(
      <CategoriesProvider>
        <CategoryStatusConsumer category="necessary" />
      </CategoriesProvider>,
    )

    const txt = screen.getByTestId('status-necessary').textContent || ''
    expect(txt).toContain('isEssential')
    expect(txt).toContain('needsToggle')
  })

  test('listens for lgpd:requiredCategories event and cleans up', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = render(
      <CategoriesProvider>
        <CategoriesConsumer />
      </CategoriesProvider>,
    )

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'lgpd:requiredCategories',
      expect.any(Function),
    )

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'lgpd:requiredCategories',
      expect.any(Function),
    )
  })

  test('logs cookie discovery in development', () => {
    const discoverRuntimeCookiesSpy = jest
      .spyOn(cookieDiscovery, 'discoverRuntimeCookies')
      .mockReturnValue([])
    const detectConsentCookieNameSpy = jest
      .spyOn(cookieDiscovery, 'detectConsentCookieName')
      .mockReturnValue('cookie-consent')
    const consoleTableSpy = jest.spyOn(console, 'table').mockImplementation(() => {})
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})

    render(
      <CategoriesProvider>
        <CategoriesConsumer />
      </CategoriesProvider>,
    )

    expect(discoverRuntimeCookiesSpy).toHaveBeenCalled()
    expect(detectConsentCookieNameSpy).toHaveBeenCalled()
    expect(consoleGroupSpy).toHaveBeenCalledWith(
      '[🍪 LGPD-CONSENT] 🔎 Descoberta de cookies (experimental)',
    )
    expect(consoleTableSpy).toHaveBeenCalled()
  })

  test('logs cookie discovery in development without console.table', () => {
    const discoverRuntimeCookiesSpy = jest
      .spyOn(cookieDiscovery, 'discoverRuntimeCookies')
      .mockReturnValue([])
    const detectConsentCookieNameSpy = jest
      .spyOn(cookieDiscovery, 'detectConsentCookieName')
      .mockReturnValue('cookie-consent')
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const originalConsoleTable = console.table
    // @ts-ignore
    console.table = undefined

    render(
      <CategoriesProvider>
        <CategoriesConsumer />
      </CategoriesProvider>,
    )

    expect(discoverRuntimeCookiesSpy).toHaveBeenCalled()
    expect(detectConsentCookieNameSpy).toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalled()

    console.table = originalConsoleTable
  })
})

describe('useCategories', () => {
  it('should throw an error when used outside of CategoriesProvider', () => {
    // Prevent console.error from cluttering the test output
    const originalError = console.error
    console.error = jest.fn()

    expect(() => {
      render(<CategoriesConsumer />)
    }).toThrow('useCategories deve ser usado dentro de CategoriesProvider.')

    console.error = originalError
  })
})
