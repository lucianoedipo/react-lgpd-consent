// Arquivo de setup executado antes da coleta/import de módulos de teste.
// Deve ser seguro executar cedo (não usa APIs do Jest) e suprimir logs ruidosos.
// Testes que precisam dos logs podem definir (globalThis as { __SHOW_DEV_GUIDANCE?: boolean }).__SHOW_DEV_GUIDANCE = true
// antes de executar o jest runner.

// Observação: evite polyfills globais aqui para não impactar o agendador do React.
const SHOULD_SHOW =
  (globalThis as { __SHOW_DEV_GUIDANCE?: boolean }).__SHOW_DEV_GUIDANCE === true

if (!SHOULD_SHOW) {
  const noop: (..._args: unknown[]) => void = () => {}
  // Substitui métodos do console sem depender de jest.spyOn (setupFiles roda cedo).
  try {
    // Alguns ambientes podem travar ao reatribuir funções nativas; usamos atribuição direta.

    const c = console as unknown as Partial<Console> & {
      log?: (...args: unknown[]) => void
      info?: (...args: unknown[]) => void
      warn?: (...args: unknown[]) => void
      error?: (...args: unknown[]) => void
      group?: (...args: unknown[]) => void
      groupEnd?: () => void
      table?: (tabularData?: unknown, properties?: readonly string[]) => void
    }

    c.log = noop
    c.info = noop
    if (typeof c.group === 'function') {
      c.group = noop
    }
    if (typeof c.groupEnd === 'function') {
      c.groupEnd = () => {}
    }
    c.warn = noop
    c.error = noop
    if (typeof c.table === 'function') {
      c.table = () => {}
    }
  } catch {
    // Não falhar se não for possível sobrescrever -- apenas siga em frente.
  }
}
