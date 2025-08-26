import '@testing-library/jest-dom'

// Suprime logs ruidosos do developerGuidance durante a maior parte dos testes.
// Testes que precisam observar os logs podem definir (global as any).__SHOW_DEV_GUIDANCE = true
// antes de importar/utilizar as funções que geram logs.
const SHOULD_SHOW = (global as any).__SHOW_DEV_GUIDANCE === true

if (!SHOULD_SHOW) {
	const noop = () => {}
	// Substitui métodos de console por no-op para manter o output limpo.
	// Alguns testes fecham seus próprios spies; restauraremos tudo após cada teste de forma segura.
	beforeAll(() => {
		jest.spyOn(console, 'log').mockImplementation(noop)
		jest.spyOn(console, 'info').mockImplementation(noop)
		// group/groupEnd usados pelo developer guidance
		// nem todos os ambientes possuem essas funções, então verificamos
		if ((console as any).group) jest.spyOn(console, 'group').mockImplementation(noop)
		if ((console as any).groupEnd) jest.spyOn(console, 'groupEnd').mockImplementation(noop)
		jest.spyOn(console, 'warn').mockImplementation(noop)
		jest.spyOn(console, 'error').mockImplementation(noop)
		if ((console as any).table) jest.spyOn(console, 'table').mockImplementation(noop)
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})
}
