/**
 * Testes de idempotência do scriptLoader
 * Foco: garantir que loadScript não cria duplicatas
 */

import { loadScript } from './scriptLoader'

// Mock simplificado de setTimeout
jest.useFakeTimers()

describe('scriptLoader - idempotency', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.cookie = ''
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  test('resolve imediatamente se script já existe no DOM', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    // Adicionar script manualmente
    const existingScript = document.createElement('script')
    existingScript.id = 'already-loaded'
    existingScript.src = 'https://example.com/existing.js'
    document.body.appendChild(existingScript)

    // loadScript deve resolver imediatamente
    const promise = loadScript('already-loaded', 'https://example.com/existing.js', 'analytics')

    // Avançar timers (não deve precisar)
    jest.runAllTimers()

    await promise

    // Não deve haver duplicata
    const scripts = document.querySelectorAll('script#already-loaded')
    expect(scripts).toHaveLength(1)
  })

  test('cria apenas um script no DOM', async () => {
    const consent = {
      consented: true,
      isModalOpen: false,
      preferences: { analytics: true },
    }
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consent))}`

    const promise = loadScript('test-script', 'https://example.com/test.js', 'analytics')

    // Avançar timers para processarconsentimento
    jest.runAllTimers()

    const script = document.getElementById('test-script') as HTMLScriptElement
    expect(script).toBeTruthy()

    // Simular load
    script.dispatchEvent(new Event('load'))

    await promise

    // Tentar carregar novamente
    const promise2 = loadScript('test-script', 'https://example.com/test.js', 'analytics')

    await promise2

    // Ainda deve haver apenas um script
    const scripts = document.querySelectorAll('script#test-script')
    expect(scripts).toHaveLength(1)
  })
})
