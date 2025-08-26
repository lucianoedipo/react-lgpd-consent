import { logger, setDebugLogging, LogLevel } from './logger'

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
})
