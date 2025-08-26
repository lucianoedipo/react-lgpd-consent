import { loadScript } from './scriptLoader'

// Suprimir logs do developerGuidance durante estes testes
let __logSpy: jest.SpyInstance, __infoSpy: jest.SpyInstance, __groupSpy: jest.SpyInstance, __warnSpy: jest.SpyInstance, __errorSpy: jest.SpyInstance

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

  test('rejects when category not consented', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: false },
    }

    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    await expect(
      loadScript('test-script-2', 'https://example.com/script.js', 'analytics'),
    ).rejects.toThrow('Consent not given for analytics scripts')
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
})
