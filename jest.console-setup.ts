// Arquivo de setup executado antes da coleta/import de módulos de teste.
// Deve ser seguro executar cedo (não usa APIs do Jest) e suprimir logs ruidosos.
// Testes que precisam dos logs podem definir (global as any).__SHOW_DEV_GUIDANCE = true
// antes de executar o jest runner.
const SHOULD_SHOW = (global as any).__SHOW_DEV_GUIDANCE === true

if (!SHOULD_SHOW) {
  const noop = () => {}
  // Substitui métodos do console sem depender de jest.spyOn (setupFiles roda cedo).
  try {
    // Alguns ambientes podem travar ao reatribuir funções nativas; usamos atribuição direta.

    // @ts-ignore
    console.log = noop
    // @ts-ignore
    console.info = noop
    if (typeof (console as any).group === 'function') {
      // @ts-ignore
      console.group = noop
    }
    if (typeof (console as any).groupEnd === 'function') {
      // @ts-ignore
      console.groupEnd = noop
    }
    // @ts-ignore
    console.warn = noop
    // @ts-ignore
    console.error = noop
    if (typeof (console as any).table === 'function') {
      // @ts-ignore
      console.table = noop
    }
  } catch (e) {
    // Não falhar se não for possível sobrescrever -- apenas siga em frente.
  }
}
