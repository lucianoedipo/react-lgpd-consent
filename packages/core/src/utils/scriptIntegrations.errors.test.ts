import {
  createClarityIntegration,
  createIntercomIntegration,
  createMixpanelIntegration,
  createZendeskChatIntegration,
} from './scriptIntegrations'

// Mock console.warn to avoid spam in tests
const mockWarn = jest.fn()
const originalConsole = console.warn
beforeAll(() => {
  console.warn = mockWarn
})
afterAll(() => {
  console.warn = originalConsole
  jest.restoreAllMocks()
})

describe('error handling in integrations', () => {
  beforeEach(() => {
    mockWarn.mockClear()
    delete (global as any).window
    ;(global as any).window = {}
  })

  test('integrations work when functions are not available', () => {
    const m = createMixpanelIntegration({ token: 'tok' })
    const c = createClarityIntegration({ projectId: 'abc' })
    const i = createIntercomIntegration({ app_id: 'app' })
    const z = createZendeskChatIntegration({ key: 'key' })

    // No functions available in window - should not call any warnings
    expect(() => {
      m.init?.()
      c.init?.()
      i.init?.()
      z.init?.()
    }).not.toThrow()

    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('mixpanel integration handles init errors gracefully', () => {
    const m = createMixpanelIntegration({ token: 'tok' })

    // Mock mixpanel.init to throw error
    ;(global as any).window.mixpanel = {
      init: jest.fn(() => {
        throw new Error('Network error')
      }),
    }

    expect(() => m.init?.()).not.toThrow()
    expect(mockWarn).toHaveBeenCalledWith('[Mixpanel] Failed to initialize:', expect.any(Error))
  })

  test('clarity integration handles config errors gracefully', () => {
    const c = createClarityIntegration({ projectId: 'abc', upload: true })

    // Mock clarity to throw error
    ;(global as any).window.clarity = jest.fn(() => {
      throw new Error('Config error')
    })

    expect(() => c.init?.()).not.toThrow()
    expect(mockWarn).toHaveBeenCalledWith(
      '[Clarity] Failed to configure upload setting:',
      expect.any(Error),
    )
  })

  test('intercom integration handles boot errors gracefully', () => {
    const i = createIntercomIntegration({ app_id: 'app123' })

    // Mock Intercom to throw error
    ;(global as any).window.Intercom = jest.fn(() => {
      throw new Error('Boot error')
    })

    expect(() => i.init?.()).not.toThrow()
    expect(mockWarn).toHaveBeenCalledWith('[Intercom] Failed to boot:', expect.any(Error))
  })

  test('zendesk integration handles identify errors gracefully', () => {
    const z = createZendeskChatIntegration({ key: 'key123' })

    // Mock zE to throw error
    ;(global as any).window.zE = jest.fn(() => {
      throw new Error('Identify error')
    })

    expect(() => z.init?.()).not.toThrow()
    expect(mockWarn).toHaveBeenCalledWith('[Zendesk] Failed to identify:', expect.any(Error))
  })
})
