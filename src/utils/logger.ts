/**
 * @enum LogLevel
 * Define os níveis de severidade para os logs da biblioteca.
 */
export enum LogLevel {
  /** Mensagens de erro críticas. */
  ERROR = 0,
  /** Mensagens de aviso sobre possíveis problemas. */
  WARN = 1,
  /** Mensagens informativas sobre o fluxo da aplicação. */
  INFO = 2,
  /** Mensagens detalhadas para depuração. */
  DEBUG = 3,
}

class ConsentLogger {
  private static readonly IS_DEVELOPMENT =
    typeof globalThis !== 'undefined' &&
    (globalThis as any).process?.env?.NODE_ENV === 'development'

  private static readonly LOG_PREFIX = '[react-lgpd-consent]'

  private enabled: boolean = ConsentLogger.IS_DEVELOPMENT
  private level: LogLevel = LogLevel.INFO

  /**
   * Habilita ou desabilita o sistema de logging.
   * @param {boolean} enabled Se `true`, os logs serão exibidos; caso contrário, serão suprimidos.
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  /**
   * Define o nível mínimo de severidade para os logs.
   * Mensagens com severidade menor que o nível definido não serão exibidas.
   * @param {LogLevel} level O nível mínimo de severidade (ex: `LogLevel.DEBUG` para ver todos os logs).
   */
  setLevel(level: LogLevel) {
    this.level = level
  }

  /**
   * Registra uma mensagem de erro.
   * @param {...any[]} args Os argumentos a serem logados.
   */
  error(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.ERROR) {
      console.error(ConsentLogger.LOG_PREFIX, '[ERROR]', ...args)
    }
  }

  /**
   * Registra uma mensagem de aviso.
   * @param {...any[]} args Os argumentos a serem logados.
   */
  warn(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.WARN) {
      console.warn(ConsentLogger.LOG_PREFIX, '[WARN]', ...args)
    }
  }

  /**
   * Registra uma mensagem informativa.
   * @param {...any[]} args Os argumentos a serem logados.
   */
  info(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.INFO) {
      console.info(ConsentLogger.LOG_PREFIX, '[INFO]', ...args)
    }
  }

  /**
   * Registra uma mensagem de depuração.
   * @param {...any[]} args Os argumentos a serem logados.
   */
  debug(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.debug(ConsentLogger.LOG_PREFIX, '[DEBUG]', ...args)
    }
  }

  /**
   * Inicia um grupo de logs no console.
   * @param {...any[]} args Os argumentos para o título do grupo.
   */
  group(...args: any[]) {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.group(ConsentLogger.LOG_PREFIX, ...args)
    }
  }

  /**
   * Finaliza o grupo de logs mais recente no console.
   */
  groupEnd() {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.groupEnd()
    }
  }

  /**
   * Exibe dados tabulares no console.
   * @param {any} tabularData Os dados a serem exibidos na tabela.
   * @param {string[]} [properties] Um array opcional de propriedades para exibir.
   */
  table(tabularData: any, properties?: string[]) {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.table(tabularData, properties)
    }
  }

  /**
   * Registra informações sobre a compatibilidade do tema Material-UI.
   * @param {any} themeInfo Objeto com informações do tema.
   */
  themeCompatibility(themeInfo: any) {
    this.debug('Theme compatibility check:', {
      hasTheme: !!themeInfo,
      hasPalette: !!themeInfo?.palette,
      hasPrimary: !!themeInfo?.palette?.primary,
      hasTransitions: !!themeInfo?.transitions,
      hasDuration: !!themeInfo?.transitions?.duration,
    })
  }

  /**
   * Registra mudanças no estado de consentimento.
   * @param {string} action A ação que causou a mudança de estado.
   * @param {any} state O estado atual do consentimento.
   */
  consentState(action: string, state: any) {
    this.debug(`Consent state change [${action}]:`, {
      consented: state.consented,
      isModalOpen: state.isModalOpen,
      preferencesCount: Object.keys(state.preferences || {}).length,
    })
  }

  /**
   * Registra operações de cookie (leitura, escrita, remoção).
   * @param {'read' | 'write' | 'delete'} operation O tipo de operação de cookie.
   * @param {string} cookieName O nome do cookie.
   * @param {any} [data] Os dados do cookie, se aplicável.
   */
  cookieOperation(operation: 'read' | 'write' | 'delete', cookieName: string, data?: any) {
    this.debug(`Cookie ${operation}:`, {
      name: cookieName,
      hasData: !!data,
      dataSize: data ? JSON.stringify(data).length : 0,
    })
  }

  /**
   * Registra a renderização de um componente.
   * @param {string} componentName O nome do componente.
   * @param {any} [props] As propriedades do componente.
   */
  componentRender(componentName: string, props?: any) {
    this.debug(`Component render [${componentName}]:`, {
      hasProps: !!props,
      propsKeys: props ? Object.keys(props) : [],
    })
  }

  /**
   * Registra o status de carregamento de scripts de integração.
   * @param {string} scriptName O nome do script.
   * @param {'load' | 'remove'} action A ação realizada (carregar ou remover).
   * @param {boolean} success Se a operação foi bem-sucedida.
   */
  scriptIntegration(scriptName: string, action: 'load' | 'remove', success: boolean) {
    this.info(`Script ${action} [${scriptName}]:`, success ? 'SUCCESS' : 'FAILED')
  }

  /**
   * Registra chamadas à API interna da biblioteca.
   * @param {string} method O nome do método da API chamado.
   * @param {any} [params] Os parâmetros passados para o método.
   */
  apiUsage(method: string, params?: any) {
    this.debug(`API call [${method}]:`, params)
  }
}

export const logger = new ConsentLogger()

/**
 * @function
 * Habilita ou desabilita o sistema de logging de debug da biblioteca externamente.
 * Útil para troubleshooting em produção quando necessário, pois os logs são desabilitados por padrão em builds de produção.
 *
 * @param {boolean} enabled Se `true`, os logs serão exibidos; caso contrário, serão suprimidos.
 * @param {LogLevel} [level=LogLevel.INFO] O nível mínimo de severidade para os logs. Padrão: `LogLevel.INFO`.
 *
 * @example
 * ```typescript
 * import { setDebugLogging, LogLevel } from 'react-lgpd-consent';
 *
 * // Habilitar logs detalhados em desenvolvimento
 * setDebugLogging(true, LogLevel.DEBUG);
 *
 * // Desabilitar todos os logs em produção (já é o padrão, mas pode ser forçado)
 * setDebugLogging(false);
 * ```
 */
export function setDebugLogging(enabled: boolean, level: LogLevel = LogLevel.INFO) {
  logger.setEnabled(enabled)
  logger.setLevel(level)
  logger.info(`Debug logging ${enabled ? 'enabled' : 'disabled'} with level ${LogLevel[level]}`)
}
