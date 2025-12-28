/**
 * @fileoverview
 * Testes para utilitários de eventos dataLayer (GTM).
 *
 * @author Luciano Édipo
 * @since 0.4.5
 */

import type { ConsentPreferences } from '../../types/types'
import {
  pushConsentInitializedEvent,
  pushConsentUpdatedEvent,
  useDataLayerEvents,
} from '../dataLayerEvents'

describe('dataLayerEvents', () => {
  let originalWindow: typeof globalThis.window
  const getArrayLayer = () => {
    // @ts-ignore - test mock window object
    const layer = globalThis.window.dataLayer
    if (!Array.isArray(layer)) {
      throw new Error('Expected dataLayer to be an array')
    }
    return layer
  }

  beforeEach(() => {
    originalWindow = globalThis.window
    // Deletar completamente o window para garantir isolamento
    // @ts-ignore - test mock window object
    delete (global as typeof globalThis & { window?: unknown }).window
    // Criar window limpo (sem dataLayer - ensureDataLayer criará)
    // @ts-ignore - test mock window object
    globalThis.window = {} as Window & typeof globalThis
  })

  afterEach(() => {
    // @ts-ignore - test mock window object
    delete (global as typeof globalThis & { window?: unknown }).window
    globalThis.window = originalWindow
  })

  describe('pushConsentInitializedEvent', () => {
    it('should push consent_initialized event to dataLayer', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
      }

      pushConsentInitializedEvent(categories)

      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBeDefined()
      const dataLayer = getArrayLayer()
      expect(dataLayer).toHaveLength(1)
      const event = dataLayer[0]

      expect(event).toMatchObject({
        event: 'consent_initialized',
        consent_version: '0.4.5-test',
        categories,
      })
      expect(event).toHaveProperty('timestamp')
      expect(typeof event.timestamp).toBe('string')
    })

    it('should initialize dataLayer if not present', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: true,
      }

      pushConsentInitializedEvent(categories)

      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBeDefined()
      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBeInstanceOf(Array)
    })

    it('should not throw if window is undefined (SSR)', () => {
      // @ts-ignore - test mock window object
      delete (global as typeof globalThis & { window?: unknown }).window

      const categories: ConsentPreferences = { necessary: true }

      expect(() => pushConsentInitializedEvent(categories)).not.toThrow()
    })

    it('should format timestamp as ISO 8601', () => {
      pushConsentInitializedEvent({ necessary: true })

      const event = getArrayLayer()[0]
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should use existing dataLayer if already present', () => {
      // Pre-criar dataLayer com evento existente
      const existingEvent = { event: 'custom_event', data: 'test' }
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = [existingEvent]

      const categories: ConsentPreferences = { necessary: true }
      pushConsentInitializedEvent(categories)

      const dataLayer = getArrayLayer()
      expect(dataLayer).toHaveLength(2)
      expect(dataLayer[0]).toBe(existingEvent)
      expect(dataLayer[1]).toMatchObject({
        event: 'consent_initialized',
      })
    })
  })

  describe('pushConsentUpdatedEvent', () => {
    it('should push consent_updated event with origin banner', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: false,
      }

      pushConsentUpdatedEvent(categories, 'banner')

      const dataLayer = getArrayLayer()
      expect(dataLayer).toBeDefined()
      expect(dataLayer.length).toBeGreaterThanOrEqual(1)
      // Pegar o ÚLTIMO evento (mais recente)
      const event = dataLayer[dataLayer.length - 1]

      expect(event).toMatchObject({
        event: 'consent_updated',
        consent_version: '0.4.5-test',
        origin: 'banner',
        categories,
        changed_categories: [],
      })
      expect(event).toHaveProperty('timestamp')
    })

    it('should calculate changed_categories correctly', () => {
      const previousCategories: ConsentPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
      }

      const newCategories: ConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: false,
      }

      pushConsentUpdatedEvent(newCategories, 'modal', previousCategories)

      const dataLayer = getArrayLayer()
      const event = dataLayer[dataLayer.length - 1]
      expect(event).toMatchObject({
        event: 'consent_updated',
        origin: 'modal',
        categories: newCategories,
        changed_categories: ['analytics'],
      })
    })

    it('should detect multiple changed categories', () => {
      const previousCategories: ConsentPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
      }

      const newCategories: ConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: false,
      }

      pushConsentUpdatedEvent(newCategories, 'modal', previousCategories)

      const dataLayer = getArrayLayer()
      const event = dataLayer[dataLayer.length - 1] as Record<string, unknown>
      expect(event.changed_categories).toEqual(expect.arrayContaining(['analytics', 'marketing']))
    })

    it('should support reset origin', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: false,
      }

      pushConsentUpdatedEvent(categories, 'reset')

      const dataLayer = getArrayLayer()
      const event = dataLayer[dataLayer.length - 1]
      expect(event).toMatchObject({
        event: 'consent_updated',
        origin: 'reset',
        categories,
      })
    })

    it('should support programmatic origin', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: true,
      }

      pushConsentUpdatedEvent(categories, 'programmatic')

      const dataLayer = getArrayLayer()
      const event = dataLayer[dataLayer.length - 1]
      expect(event).toMatchObject({
        event: 'consent_updated',
        origin: 'programmatic',
        categories,
      })
    })

    it('should not throw if window is undefined (SSR)', () => {
      // @ts-ignore - test mock window object
      delete (global as typeof globalThis & { window?: unknown }).window

      const categories: ConsentPreferences = { necessary: true }

      expect(() => pushConsentUpdatedEvent(categories, 'banner')).not.toThrow()
    })

    it('should handle empty changed_categories when no previousCategories provided', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: true,
      }

      pushConsentUpdatedEvent(categories, 'modal')

      const dataLayer = getArrayLayer()
      const event = dataLayer[dataLayer.length - 1]
      expect(event).toMatchObject({
        event: 'consent_updated',
        changed_categories: [],
      })
    })

    it('should preserve dataLayer if already exists', () => {
      // Pre-criar dataLayer
      const existingEvent = { event: 'page_view' }
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = [existingEvent]

      pushConsentUpdatedEvent({ necessary: true }, 'banner')

      const dataLayer = getArrayLayer()
      expect(dataLayer).toHaveLength(2)
      expect(dataLayer[0]).toBe(existingEvent)
    })
  })

  describe('useDataLayerEvents', () => {
    afterEach(() => {
      // Limpar window após cada teste deste describe
      // @ts-ignore - test mock window object
      if (globalThis.window?.dataLayer) {
        // @ts-ignore - test mock window object
        globalThis.window.dataLayer = []
      }
    })

    it('should return helper functions', () => {
      // Limpar dataLayer antes do teste
      // @ts-ignore - test mock window object
      if (globalThis.window?.dataLayer) {
        // @ts-ignore - test mock window object
        globalThis.window.dataLayer = []
      }

      const helpers = useDataLayerEvents()

      expect(helpers).toHaveProperty('pushInitialized')
      expect(helpers).toHaveProperty('pushUpdated')
      expect(typeof helpers.pushInitialized).toBe('function')
      expect(typeof helpers.pushUpdated).toBe('function')
    })

    it('pushInitialized should work correctly', () => {
      // Limpar dataLayer antes do teste
      // @ts-ignore - test mock window object
      if (globalThis.window?.dataLayer) {
        // @ts-ignore - test mock window object
        globalThis.window.dataLayer = []
      }

      const helpers = useDataLayerEvents()
      const categories: ConsentPreferences = { necessary: true }

      helpers.pushInitialized(categories)

      // @ts-ignore - test mock window object
      const dataLayer = getArrayLayer()
      expect(dataLayer).toBeDefined()
      expect(dataLayer).toHaveLength(1)
      const event = dataLayer[0]
      expect(event).toMatchObject({
        event: 'consent_initialized',
        categories,
      })
    })

    it('pushUpdated should work correctly', () => {
      // Limpar dataLayer antes do teste
      // @ts-ignore - test mock window object
      if (globalThis.window?.dataLayer) {
        // @ts-ignore - test mock window object
        globalThis.window.dataLayer = []
      }

      const helpers = useDataLayerEvents()
      const categories: ConsentPreferences = { necessary: true, analytics: true }

      helpers.pushUpdated(categories, 'modal')

      const dataLayer = getArrayLayer()
      expect(dataLayer).toBeDefined()
      expect(dataLayer).toHaveLength(1)
      const event = dataLayer[0]
      expect(event).toMatchObject({
        event: 'consent_updated',
        origin: 'modal',
        categories,
      })
    })
  })

  describe('ensureDataLayer internal coverage', () => {
    it('should create dataLayer if window exists but dataLayer is undefined', () => {
      // Garantir que window existe mas dataLayer não
      // @ts-ignore - test mock window object
      delete globalThis.window.dataLayer

      pushConsentInitializedEvent({ necessary: true })

      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBeDefined()
      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBeInstanceOf(Array)
    })

    it('should create dataLayer when window.dataLayer is null', () => {
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = null

      pushConsentInitializedEvent({ necessary: true })

      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBeInstanceOf(Array)
    })

    it('should warn in dev when dataLayer exists without push', () => {
      const originalEnv = process.env.NODE_ENV
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

      process.env.NODE_ENV = 'development'
      // @ts-ignore - test mock window object
      const customLayer = {}
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = customLayer

      pushConsentInitializedEvent({ necessary: true })

      expect(warnSpy).toHaveBeenCalledWith(
        '[LGPD-CONSENT] dataLayer presente mas sem push; eventos não serão registrados.',
      )
      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBe(customLayer)

      process.env.NODE_ENV = originalEnv
      warnSpy.mockRestore()
    })

    it('should not warn in production when dataLayer exists without push', () => {
      const originalEnv = process.env.NODE_ENV
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

      process.env.NODE_ENV = 'production'
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = {}

      pushConsentInitializedEvent({ necessary: true })

      expect(warnSpy).not.toHaveBeenCalled()

      process.env.NODE_ENV = originalEnv
      warnSpy.mockRestore()
    })

    it('treats missing NODE_ENV as production (no warning)', () => {
      const originalEnv = process.env.NODE_ENV
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

      delete process.env.NODE_ENV
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = {}

      pushConsentInitializedEvent({ necessary: true })

      expect(warnSpy).not.toHaveBeenCalled()

      process.env.NODE_ENV = originalEnv
      warnSpy.mockRestore()
    })

    it('should use custom dataLayer object with push function', () => {
      const pushSpy = jest.fn()
      // @ts-ignore - test mock window object
      const customLayer = { push: pushSpy }
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = customLayer

      pushConsentInitializedEvent({ necessary: true })

      expect(pushSpy).toHaveBeenCalledTimes(1)
      // @ts-ignore - test mock window object
      expect(globalThis.window.dataLayer).toBe(customLayer)
    })

    it('should preserve existing dataLayer entries when pushing new events', () => {
      const existingEvent = { event: 'page_view', page: '/home' }
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = [existingEvent]

      pushConsentInitializedEvent({ necessary: true })
      pushConsentUpdatedEvent({ necessary: true, analytics: true }, 'banner')

      const dataLayer = getArrayLayer()
      expect(dataLayer).toHaveLength(3)
      expect(dataLayer[0]).toBe(existingEvent)
    })
  })

  describe('pushConsentUpdatedEvent edge cases', () => {
    it('should handle programmatic origin', () => {
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = []

      pushConsentUpdatedEvent({ necessary: true }, 'programmatic')

      const event = getArrayLayer()[0] as Record<string, unknown>
      expect(event.origin).toBe('programmatic')
    })

    it('should handle empty previousCategories', () => {
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = []

      pushConsentUpdatedEvent({ necessary: true, analytics: true }, 'banner', {
        necessary: false,
      } as ConsentPreferences)

      const event = getArrayLayer()[0] as Record<string, unknown>
      // Quando previousCategories é diferente, changed_categories contém mudanças
      expect((event.changed_categories as string[]).length).toBeGreaterThan(0)
    })

    it('should include consent_version in events', () => {
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = []

      pushConsentInitializedEvent({ necessary: true })

      const event = getArrayLayer()[0]
      expect(event.consent_version).toBeDefined()
      expect(typeof event.consent_version).toBe('string')
    })

    it('should not throw when dataLayer push fails silently', () => {
      // @ts-ignore - test mock window object
      globalThis.window.dataLayer = {
        push: () => {
          /* no-op */
        },
      }

      expect(() => pushConsentInitializedEvent({ necessary: true })).not.toThrow()
      expect(() => pushConsentUpdatedEvent({ necessary: true }, 'banner')).not.toThrow()
    })
  })

  describe('SSR safety', () => {
    it('should not throw when window is undefined', () => {
      const originalWindow = globalThis.window
      // @ts-ignore - test mock window object
      delete (global as typeof globalThis & { window?: unknown }).window

      expect(() => pushConsentInitializedEvent({ necessary: true })).not.toThrow()
      expect(() => pushConsentUpdatedEvent({ necessary: true }, 'modal')).not.toThrow()

      globalThis.window = originalWindow
    })

    it('should not throw when window is partially defined', () => {
      // @ts-ignore - test mock window object
      globalThis.window = { location: {} }

      expect(() => pushConsentInitializedEvent({ necessary: true })).not.toThrow()
      expect(() => pushConsentUpdatedEvent({ necessary: true }, 'modal')).not.toThrow()
    })
  })
})
