import { logger, LogLevel, setDebugLogging } from '../logger'

// console.* é suprimido globalmente em jest.setup.ts

describe('logger', () => {
  let origConsole: any

  beforeEach(() => {
    origConsole = { ...console }
    console.error = jest.fn()
    console.warn = jest.fn()
    console.info = jest.fn()
    console.debug = jest.fn()
    console.group = jest.fn()
    console.groupEnd = jest.fn()
    console.table = jest.fn()
  })

  afterEach(() => {
    // restore original console
    Object.assign(console, origConsole)
  })

  test('does not log when disabled', () => {
    setDebugLogging(false)
    logger.error('err')
    logger.warn('w')
    logger.info('i')
    logger.debug('d')

    expect(console.error).not.toHaveBeenCalled()
    expect(console.warn).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.debug).not.toHaveBeenCalled()
  })

  test('respects log level', () => {
    setDebugLogging(true, LogLevel.WARN)
    logger.error('err')
    logger.warn('w')
    logger.info('i')
    logger.debug('d')

    expect(console.error).toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.debug).not.toHaveBeenCalled()
  })

  test('debug-level enables groups and table', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.group('g')
    logger.table([{ a: 1 }])
    logger.groupEnd()

    expect(console.group).toHaveBeenCalled()
    expect(console.table).toHaveBeenCalled()
    expect(console.groupEnd).toHaveBeenCalled()
  })

  test('table accepts optional properties parameter', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.table([{ a: 1, b: 2 }], ['a'])

    expect(console.table).toHaveBeenCalledWith([{ a: 1, b: 2 }], ['a'])
  })

  test('themeCompatibility logs theme info', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    const theme = {
      palette: {
        primary: { main: '#000' },
      },
      transitions: {
        duration: { short: 250 },
      },
    }

    logger.themeCompatibility(theme)

    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[DEBUG]'),
      'Theme compatibility check:',
      expect.objectContaining({
        hasTheme: true,
        hasPalette: true,
        hasPrimary: true,
        hasTransitions: true,
        hasDuration: true,
      }),
    )
  })

  test('themeCompatibility handles invalid theme objects', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.themeCompatibility(null)
    logger.themeCompatibility(undefined)
    logger.themeCompatibility({})
    logger.themeCompatibility({ palette: null })

    expect(console.debug).toHaveBeenCalled()
  })

  test('consentState logs state changes', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.consentState('acceptAll', {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    })

    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[DEBUG]'),
      'Consent state change [acceptAll]:',
      expect.objectContaining({
        consented: true,
        isModalOpen: false,
        preferencesCount: 1,
      }),
    )
  })

  test('cookieOperation logs cookie operations', () => {
    setDebugLogging(true, LogLevel.DEBUG)

    logger.cookieOperation('write', 'consent_prefs', { analytics: true })
    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[DEBUG]'),
      'Cookie write:',
      expect.objectContaining({
        name: 'consent_prefs',
        hasData: true,
        dataSize: expect.any(Number),
      }),
    )

    logger.cookieOperation('read', 'consent_prefs')
    logger.cookieOperation('delete', 'consent_prefs')

    expect(console.debug).toHaveBeenCalledTimes(3)
  })

  test('componentRender logs component rendering', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.componentRender('CookieBanner', { debug: true })

    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[DEBUG]'),
      'Component render [CookieBanner]:',
      expect.objectContaining({
        hasProps: true,
        propsKeys: ['debug'],
      }),
    )
  })

  test('componentRender handles components without props', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.componentRender('CookieBanner')

    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[DEBUG]'),
      'Component render [CookieBanner]:',
      expect.objectContaining({
        hasProps: false,
        propsKeys: [],
      }),
    )
  })

  test('scriptIntegration logs script operations', () => {
    setDebugLogging(true, LogLevel.INFO)
    logger.scriptIntegration('google-analytics', 'load', true)
    logger.scriptIntegration('google-analytics', 'remove', false)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[INFO]'),
      'Script load [google-analytics]:',
      'SUCCESS',
    )

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[react-lgpd-consent]'),
      expect.stringContaining('[INFO]'),
      'Script remove [google-analytics]:',
      'FAILED',
    )
  })

  test('apiUsage logs API calls', () => {
    setDebugLogging(true, LogLevel.DEBUG)
    logger.apiUsage('acceptAll')
    logger.apiUsage('setPreference', { analytics: true })

    expect(console.debug).toHaveBeenCalledTimes(2)
  })

  test('suppresses non-error logs in production', () => {
    // Mock globalThis.process.env.NODE_ENV (logger usa globalThis, não process direto)
    const originalGlobalThis = (globalThis as any).process
    ;(globalThis as any).process = {
      env: { NODE_ENV: 'production' },
    }

    // Importar novamente para pegar a nova configuração
    jest.resetModules()
    const {
      logger: prodLogger,
      setDebugLogging: setProdLogging,
      LogLevel: ProdLevel,
    } = require('../logger')

    setProdLogging(true, ProdLevel.DEBUG)

    prodLogger.warn('warning')
    prodLogger.info('info')
    prodLogger.debug('debug')

    expect(console.warn).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.debug).not.toHaveBeenCalled()

    // Restaurar
    ;(globalThis as any).process = originalGlobalThis
    jest.resetModules()
  })

  test('allows error logs in production', () => {
    // Mock globalThis.process.env.NODE_ENV
    const originalGlobalThis = (globalThis as any).process
    ;(globalThis as any).process = {
      env: { NODE_ENV: 'production' },
    }

    jest.resetModules()
    const {
      logger: prodLogger,
      setDebugLogging: setProdLogging,
      LogLevel: ProdLevel,
    } = require('../logger')

    setProdLogging(true, ProdLevel.ERROR)
    prodLogger.error('critical error')

    expect(console.error).toHaveBeenCalled()

    // Restaurar
    ;(globalThis as any).process = originalGlobalThis
    jest.resetModules()
  })
})
