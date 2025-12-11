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
  let originalWindow: typeof global.window

  beforeEach(() => {
    originalWindow = global.window
    // Deletar completamente o window para garantir isolamento
    // @ts-ignore - test mock window object
    delete (global as typeof globalThis & { window?: unknown }).window
    // Criar window limpo (sem dataLayer - ensureDataLayer criará)
    // @ts-ignore - test mock window object
    global.window = {} as Window & typeof globalThis
  })

  afterEach(() => {
    // @ts-ignore - test mock window object
    delete (global as typeof globalThis & { window?: unknown }).window
    global.window = originalWindow
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
      expect(global.window.dataLayer).toBeDefined()
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toHaveLength(1)
      // @ts-ignore - test mock window object
      const event = global.window.dataLayer[0]

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
      expect(global.window.dataLayer).toBeDefined()
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toBeInstanceOf(Array)
    })

    it('should not throw if window is undefined (SSR)', () => {
      // @ts-ignore - test mock window object
      delete (global as typeof globalThis & { window?: unknown }).window

      const categories: ConsentPreferences = { necessary: true }

      expect(() => pushConsentInitializedEvent(categories)).not.toThrow()
    })

    it('should format timestamp as ISO 8601', () => {
      pushConsentInitializedEvent({ necessary: true })

      // @ts-ignore - test mock window object
      const event = global.window.dataLayer[0]
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should use existing dataLayer if already present', () => {
      // Pre-criar dataLayer com evento existente
      const existingEvent = { event: 'custom_event', data: 'test' }
      // @ts-ignore - test mock window object
      global.window.dataLayer = [existingEvent]

      const categories: ConsentPreferences = { necessary: true }
      pushConsentInitializedEvent(categories)

      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toHaveLength(2)
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer[0]).toBe(existingEvent)
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer[1]).toMatchObject({
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

      // @ts-ignore - test mock window object
      const dataLayer = global.window.dataLayer
      expect(dataLayer).toBeDefined()
      expect(dataLayer!.length).toBeGreaterThanOrEqual(1)
      // Pegar o ÚLTIMO evento (mais recente)
      // @ts-ignore - test mock window object
      const event = dataLayer[dataLayer!.length - 1]

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

      // @ts-ignore - test mock window object
      const dataLayer = global.window.dataLayer
      // @ts-ignore - test mock window object
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

      // @ts-ignore - test mock window object
      const dataLayer = global.window.dataLayer
      // @ts-ignore - test mock window object
      const event = dataLayer[dataLayer.length - 1] as Record<string, unknown>
      expect(event.changed_categories).toEqual(expect.arrayContaining(['analytics', 'marketing']))
    })

    it('should support reset origin', () => {
      const categories: ConsentPreferences = {
        necessary: true,
        analytics: false,
      }

      pushConsentUpdatedEvent(categories, 'reset')

      // @ts-ignore - test mock window object
      const dataLayer = global.window.dataLayer
      // @ts-ignore - test mock window object
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

      // @ts-ignore - test mock window object
      const dataLayer = global.window.dataLayer
      // @ts-ignore - test mock window object
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

      // @ts-ignore - test mock window object
      const dataLayer = global.window.dataLayer
      // @ts-ignore - test mock window object
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
      global.window.dataLayer = [existingEvent]

      pushConsentUpdatedEvent({ necessary: true }, 'banner')

      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toHaveLength(2)
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer[0]).toBe(existingEvent)
    })
  })

  describe('useDataLayerEvents', () => {
    afterEach(() => {
      // Limpar window após cada teste deste describe
      // @ts-ignore - test mock window object
      if (global.window?.dataLayer) {
        // @ts-ignore - test mock window object
        global.window.dataLayer = []
      }
    })

    it('should return helper functions', () => {
      // Limpar dataLayer antes do teste
      // @ts-ignore - test mock window object
      if (global.window?.dataLayer) {
        // @ts-ignore - test mock window object
        global.window.dataLayer = []
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
      if (global.window?.dataLayer) {
        // @ts-ignore - test mock window object
        global.window.dataLayer = []
      }

      const helpers = useDataLayerEvents()
      const categories: ConsentPreferences = { necessary: true }

      helpers.pushInitialized(categories)

      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toBeDefined()
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toHaveLength(1)
      // @ts-ignore - test mock window object
      const event = global.window.dataLayer[0]
      expect(event).toMatchObject({
        event: 'consent_initialized',
        categories,
      })
    })

    it('pushUpdated should work correctly', () => {
      // Limpar dataLayer antes do teste
      // @ts-ignore - test mock window object
      if (global.window?.dataLayer) {
        // @ts-ignore - test mock window object
        global.window.dataLayer = []
      }

      const helpers = useDataLayerEvents()
      const categories: ConsentPreferences = { necessary: true, analytics: true }

      helpers.pushUpdated(categories, 'modal')

      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toBeDefined()
      // @ts-ignore - test mock window object
      expect(global.window.dataLayer).toHaveLength(1)
      // @ts-ignore - test mock window object
      const event = global.window.dataLayer[0]
      expect(event).toMatchObject({
        event: 'consent_updated',
        origin: 'modal',
        categories,
      })
    })
  })
})
