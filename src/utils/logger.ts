/**
 * Sistema de logging interno da biblioteca para facilitar debug e troubleshooting.
 * Os logs são desabilitados automaticamente em production builds.
 */

const IS_DEVELOPMENT =
  typeof globalThis !== 'undefined' &&
  (globalThis as any).process?.env?.NODE_ENV === 'development'

const LOG_PREFIX = '[react-lgpd-consent]'

/* eslint-disable no-unused-vars */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}
/* eslint-enable no-unused-vars */

class ConsentLogger {
  private enabled: boolean = IS_DEVELOPMENT
  private level: LogLevel = LogLevel.INFO

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setLevel(level: LogLevel) {
    this.level = level
  }

  error(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.ERROR) {
      console.error(LOG_PREFIX, '[ERROR]', ...args)
    }
  }

  warn(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.WARN) {
      console.warn(LOG_PREFIX, '[WARN]', ...args)
    }
  }

  info(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.INFO) {
      console.info(LOG_PREFIX, '[INFO]', ...args)
    }
  }

  debug(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.debug(LOG_PREFIX, '[DEBUG]', ...args)
    }
  }

  // Logs específicos para troubleshooting
  themeCompatibility(themeInfo: any) {
    this.debug('Theme compatibility check:', {
      hasTheme: !!themeInfo,
      hasPalette: !!themeInfo?.palette,
      hasPrimary: !!themeInfo?.palette?.primary,
      hasTransitions: !!themeInfo?.transitions,
      hasDuration: !!themeInfo?.transitions?.duration,
    })
  }

  consentState(action: string, state: any) {
    this.debug(`Consent state change [${action}]:`, {
      consented: state.consented,
      isModalOpen: state.isModalOpen,
      preferencesCount: Object.keys(state.preferences || {}).length,
    })
  }

  cookieOperation(
    operation: 'read' | 'write' | 'delete',
    cookieName: string,
    data?: any,
  ) {
    this.debug(`Cookie ${operation}:`, {
      name: cookieName,
      hasData: !!data,
      dataSize: data ? JSON.stringify(data).length : 0,
    })
  }

  componentRender(componentName: string, props?: any) {
    this.debug(`Component render [${componentName}]:`, {
      hasProps: !!props,
      propsKeys: props ? Object.keys(props) : [],
    })
  }

  scriptIntegration(
    scriptName: string,
    action: 'load' | 'remove',
    success: boolean,
  ) {
    this.info(
      `Script ${action} [${scriptName}]:`,
      success ? 'SUCCESS' : 'FAILED',
    )
  }

  apiUsage(method: string, params?: any) {
    this.debug(`API call [${method}]:`, params)
  }
}

export const logger = new ConsentLogger()

/**
 * Função para habilitar/desabilitar logs de debug externamente.
 * Útil para troubleshooting em produção quando necessário.
 *
 * @example
 * ```typescript
 * import { setDebugLogging } from 'react-lgpd-consent'
 *
 * // Habilitar logs detalhados
 * setDebugLogging(true, LogLevel.DEBUG)
 * ```
 */
export function setDebugLogging(
  enabled: boolean,
  level: LogLevel = LogLevel.INFO,
) {
  logger.setEnabled(enabled)
  logger.setLevel(level)
  logger.info(
    `Debug logging ${enabled ? 'enabled' : 'disabled'} with level ${LogLevel[level]}`,
  )
}
