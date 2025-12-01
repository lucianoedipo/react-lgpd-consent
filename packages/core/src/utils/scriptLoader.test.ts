import { loadScript } from './scriptLoader'

// Suprimir logs do developerGuidance durante estes testes
let __logSpy: jest.SpyInstance,
  __infoSpy: jest.SpyInstance,
  __groupSpy: jest.SpyInstance,
  __warnSpy: jest.SpyInstance,
  __errorSpy: jest.SpyInstance

beforeAll(() => {
  // console.* é suprimido globalmente em jest.setup.ts
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('loadScript', () => {
  beforeEach(() => {
    // limpa DOM e cookies entre testes
    document.body.innerHTML = ''
    // reset cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    })
  })

  test('resolves and appends script when consent present for category', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }

    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    const promise = loadScript('test-script', 'https://example.com/script.js', 'analytics')

    // script should be appended to the DOM
    const script = document.getElementById('test-script') as HTMLScriptElement | null
    expect(script).toBeTruthy()
    if (!script) throw new Error('script not found')

    // simulate successful load
    script.dispatchEvent(new Event('load'))

    await expect(promise).resolves.toBeUndefined()
    expect(script.src).toContain('https://example.com/script.js')
  })

  test('waits for consent when category not initially consented', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: false },
    }

    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    const scriptPromise = loadScript('test-script-2', 'https://example.com/script.js', 'analytics')

    // Aguardar um pouco para garantir que está em polling
    await new Promise((resolve) => setTimeout(resolve, 250))

    // Verificar que o script ainda não foi adicionado
    expect(document.getElementById('test-script-2')).toBeNull()

    // Simular mudança de preferência
    const updatedConsent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(updatedConsent))}`

    // Aguardar mais um pouco para o polling detectar a mudança
    await new Promise((resolve) => setTimeout(resolve, 250))

    // Agora o script deve estar no DOM
    const script = document.getElementById('test-script-2') as HTMLScriptElement
    expect(script).toBeTruthy()
    expect(script.src).toBe('https://example.com/script.js')

    // Simular carregamento bem-sucedido
    script.dispatchEvent(new Event('load'))

    // A Promise deve resolver
    await expect(scriptPromise).resolves.toBeUndefined()
  })

  test('rejects when script load errors', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }

    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    const promise = loadScript('test-script-3', 'https://example.com/fail.js', 'analytics')
    const script = document.getElementById('test-script-3') as HTMLScriptElement | null
    expect(script).toBeTruthy()
    if (!script) throw new Error('script not found')

    // simulate error
    script.dispatchEvent(new Event('error'))

    await expect(promise).rejects.toThrow('Failed to load script: https://example.com/fail.js')
  })

  test('resolves immediately if element already exists', async () => {
    // create element with same id
    const existing = document.createElement('script')
    existing.id = 'already'
    document.body.appendChild(existing)

    // should resolve without adding another
    await expect(loadScript('already', 'https://example.com/ok.js')).resolves.toBeUndefined()
    const found = document.querySelectorAll('script#already')
    expect(found.length).toBe(1)
  })

  test('waits and retries when no consent cookie present', async () => {
    // No cookie set
    document.cookie = ''

    // Use fake timers
    jest.useFakeTimers()

    const promise = loadScript('test-retry', 'https://example.com/script.js', 'analytics')

    // Advance time to trigger first retry
    jest.advanceTimersByTime(100)

    // Now set a proper consent cookie
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    // Advance time to trigger the next check
    jest.advanceTimersByTime(100)

    // Script should now be loaded
    const script = document.getElementById('test-retry') as HTMLScriptElement | null
    expect(script).toBeTruthy()
    if (script) script.dispatchEvent(new Event('load'))

    await expect(promise).resolves.toBeUndefined()
    jest.useRealTimers()
  })

  test('waits and retries when modal is open', async () => {
    const consent = {
      consented: true,
      isModalOpen: true, // Modal is open
      preferences: { analytics: true },
    }

    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    jest.useFakeTimers()

    const promise = loadScript('test-modal-open', 'https://example.com/script.js', 'analytics')

    // Advance time to trigger retry
    jest.advanceTimersByTime(100)

    // Close modal and advance time again
    const updatedConsent = { ...consent, isModalOpen: false }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(updatedConsent))}`

    jest.advanceTimersByTime(100)

    const script = document.getElementById('test-modal-open') as HTMLScriptElement | null
    if (script) script.dispatchEvent(new Event('load'))

    await expect(promise).resolves.toBeUndefined()
    jest.useRealTimers()
  })

  test('handles malformed consent cookie with retry', async () => {
    // Set malformed JSON cookie
    document.cookie = 'cookieConsent=invalid-json'

    jest.useFakeTimers()

    const promise = loadScript('test-malformed', 'https://example.com/script.js', 'analytics')

    // Advance time to trigger retry
    jest.advanceTimersByTime(100)

    // Fix the cookie and advance time again
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    jest.advanceTimersByTime(100)

    const script = document.getElementById('test-malformed') as HTMLScriptElement | null
    if (script) script.dispatchEvent(new Event('load'))

    await expect(promise).resolves.toBeUndefined()
    jest.useRealTimers()
  })

  test('applies custom attributes to script element', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }

    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    const customAttrs = {
      'data-test': 'value',
      defer: 'true',
      crossorigin: 'anonymous',
    }

    const promise = loadScript(
      'test-attrs',
      'https://example.com/script.js',
      'analytics',
      customAttrs,
    )

    const script = document.getElementById('test-attrs') as HTMLScriptElement | null
    expect(script).toBeTruthy()
    if (!script) throw new Error('script not found')

    // Check that custom attributes were applied
    expect(script.getAttribute('data-test')).toBe('value')
    expect(script.getAttribute('defer')).toBe('true')
    expect(script.getAttribute('crossorigin')).toBe('anonymous')

    script.dispatchEvent(new Event('load'))
    await expect(promise).resolves.toBeUndefined()
  })

  test('loads when category is null (no category gating)', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: false },
    }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`
    const p = loadScript('no-cat', 'https://example.com/ok.js', null)
    const script = document.getElementById('no-cat') as HTMLScriptElement | null
    expect(script).toBeTruthy()
    if (script) script.dispatchEvent(new Event('load'))
    await expect(p).resolves.toBeUndefined()
  })
})
