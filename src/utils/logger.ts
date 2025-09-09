/**
 * @enum LogLevel
 * @category Utils
 * @since 0.3.1
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
    (globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV === 'development'

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
   * @param {...unknown[]} args Argumentos a serem logados.
   */
  error(...args: unknown[]) {
    if (this.enabled && this.level >= LogLevel.ERROR) {
      console.error(ConsentLogger.LOG_PREFIX, '[ERROR]', ...args)
    }
  }

  /**
   * Registra uma mensagem de aviso.
   * @param {...unknown[]} args Argumentos a serem logados.
   */
  warn(...args: unknown[]) {
    if (this.enabled && this.level >= LogLevel.WARN) {
      console.warn(ConsentLogger.LOG_PREFIX, '[WARN]', ...args)
    }
  }

  /**
   * Registra uma mensagem informativa.
   * @param {...unknown[]} args Argumentos a serem logados.
   */
  info(...args: unknown[]) {
    if (this.enabled && this.level >= LogLevel.INFO) {
      console.info(ConsentLogger.LOG_PREFIX, '[INFO]', ...args)
    }
  }

  /**
   * Registra uma mensagem de depuração.
   * @param {...unknown[]} args Argumentos a serem logados.
   */
  debug(...args: unknown[]) {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.debug(ConsentLogger.LOG_PREFIX, '[DEBUG]', ...args)
    }
  }

  /**
   * Inicia um grupo de logs no console.
   * @param {...unknown[]} args Argumentos para o título do grupo.
   */
  group(...args: unknown[]) {
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
   * @param {unknown} tabularData Dados a serem exibidos na tabela.
   * @param {string[]} [properties] Propriedades opcionais para exibir.
   */
  table(tabularData: unknown, properties?: string[]) {
    if (this.enabled && this.level >= LogLevel.DEBUG) {
      console.table(tabularData, properties)
    }
  }

  /**
   * Registra informações sobre a compatibilidade do tema Material-UI.
   * @param {unknown} themeInfo Objeto potencialmente parcial do tema (inspeção segura).
   */
  themeCompatibility(themeInfo: unknown) {
    const isRecord = (v: unknown): v is Record<string, unknown> =>
      typeof v === 'object' && v !== null
    const theme = isRecord(themeInfo) ? themeInfo : undefined
    const palette =
      theme && isRecord(theme['palette'])
        ? (theme['palette'] as Record<string, unknown>)
        : undefined
    const primary = palette && isRecord(palette['primary'])
    const transitions =
      theme && isRecord(theme['transitions'])
        ? (theme['transitions'] as Record<string, unknown>)
        : undefined
    const duration = transitions && isRecord(transitions['duration'])

    this.debug('Theme compatibility check:', {
      hasTheme: !!theme,
      hasPalette: !!palette,
      hasPrimary: !!primary,
      hasTransitions: !!transitions,
      hasDuration: !!duration,
    })
  }

  /**
   * Registra mudanças no estado de consentimento.
   * @param {string} action Ação que causou a mudança de estado.
   * @param {{ consented?: boolean; isModalOpen?: boolean; preferences?: Record<string, unknown> }} state Estado atual.
   */
  consentState(
    action: string,
    state: { consented?: boolean; isModalOpen?: boolean; preferences?: Record<string, unknown> },
  ) {
    this.debug(`Consent state change [${action}]:`, {
      consented: state.consented,
      isModalOpen: state.isModalOpen,
      preferencesCount: Object.keys(state.preferences || {}).length,
    })
  }

  /**
   * Registra operações de cookie (leitura, escrita, remoção).
   * @param {'read' | 'write' | 'delete'} operation Tipo de operação.
   * @param {string} cookieName Nome do cookie.
   * @param {unknown} [data] Dados associados, se aplicável.
   */
  cookieOperation(operation: 'read' | 'write' | 'delete', cookieName: string, data?: unknown) {
    this.debug(`Cookie ${operation}:`, {
      name: cookieName,
      hasData: !!data,
      dataSize: data ? JSON.stringify(data).length : 0,
    })
  }

  /**
   * Registra a renderização de um componente.
   * @param {string} componentName Nome do componente.
   * @param {Record<string, unknown>} [props] Propriedades do componente.
   */
  componentRender(componentName: string, props?: Record<string, unknown>) {
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
   * @param {string} method Nome do método da API chamado.
   * @param {unknown} [params] Parâmetros passados para o método.
   */
  apiUsage(method: string, params?: unknown) {
    this.debug(`API call [${method}]:`, params)
  }
}

export const logger = new ConsentLogger()

/**
 * @function
 * @category Utils
 * @since 0.3.1
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
