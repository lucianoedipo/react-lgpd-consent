/**
 * @fileoverview
 * Utilitários para disparar eventos de consentimento no dataLayer (Google Tag Manager).
 *
 * Este módulo fornece funções para enviar eventos padronizados de consentimento ao dataLayer,
 * facilitando integração com Google Tag Manager e auditoria LGPD.
 *
 * @author Luciano Édipo
 * @since 0.4.5
 * @category Utils
 */

import type {
  ConsentEvent,
  ConsentEventOrigin,
  ConsentInitializedEvent,
  ConsentPreferences,
  ConsentUpdatedEvent,
} from '../types/types'

/**
 * Versão da biblioteca (extraída do package.json em build time).
 * @internal
 */
// Versão da biblioteca, injetada em build time via tsup.define (ver tsup.config.ts)
declare const __LIBRARY_VERSION__: string
const LIBRARY_VERSION = __LIBRARY_VERSION__

/**
 * Declaração do tipo dataLayer para TypeScript.
 * @internal
 */
declare global {
  interface Window {
    dataLayer?: Array<ConsentEvent | Record<string, unknown>>
  }
}

/**
 * Garante que o dataLayer existe no globalThis.window.
 * @internal
 */
function ensureDataLayer(): void {
  if (globalThis.window === undefined) return
  globalThis.window.dataLayer ??= []
}

/**
 * Dispara o evento `consent_initialized` no dataLayer.
 *
 * @param categories - Estado inicial das categorias de consentimento
 *
 * @remarks
 * Este evento é disparado automaticamente quando o ConsentProvider é montado.
 * Útil para rastreamento de primeira visualização e auditoria LGPD.
 *
 * @example
 * ```typescript
 * pushConsentInitializedEvent({
 *   necessary: true,
 *   analytics: false,
 *   marketing: false
 * });
 *
 * // Resultado no dataLayer:
 * // {
 * //   event: 'consent_initialized',
 * //   consent_version: '0.4.5',
 * //   timestamp: '2025-10-25T13:52:33.729Z',
 * //   categories: { necessary: true, analytics: false, marketing: false }
 * // }
 * ```
 *
 * @category Utils
 * @since 0.4.5
 * @public
 */
export function pushConsentInitializedEvent(categories: ConsentPreferences): void {
  if (globalThis.window === undefined) return

  ensureDataLayer()

  const event: ConsentInitializedEvent = {
    event: 'consent_initialized',
    consent_version: LIBRARY_VERSION,
    timestamp: new Date().toISOString(),
    categories,
  }

  globalThis.window.dataLayer?.push(event)
}

/**
 * Dispara o evento `consent_updated` no dataLayer.
 *
 * @param categories - Estado atualizado das categorias de consentimento
 * @param origin - Origem da ação (banner, modal, reset, programmatic)
 * @param previousCategories - Estado anterior das categorias (opcional, para calcular mudanças)
 *
 * @remarks
 * Este evento é disparado sempre que o usuário atualiza suas preferências.
 * Inclui a origem da ação e lista de categorias modificadas.
 *
 * @example
 * ```typescript
 * // Usuário aceitou analytics no modal
 * pushConsentUpdatedEvent(
 *   { necessary: true, analytics: true, marketing: false },
 *   'modal',
 *   { necessary: true, analytics: false, marketing: false }
 * );
 *
 * // Resultado no dataLayer:
 * // {
 * //   event: 'consent_updated',
 * //   consent_version: '0.4.5',
 * //   timestamp: '2025-10-25T13:52:33.729Z',
 * //   origin: 'modal',
 * //   categories: { necessary: true, analytics: true, marketing: false },
 * //   changed_categories: ['analytics']
 * // }
 * ```
 *
 * @example
 * ```typescript
 * // Reset de consentimento
 * pushConsentUpdatedEvent(
 *   { necessary: true, analytics: false, marketing: false },
 *   'reset'
 * );
 * ```
 *
 * @category Utils
 * @since 0.4.5
 * @public
 */
export function pushConsentUpdatedEvent(
  categories: ConsentPreferences,
  origin: ConsentEventOrigin,
  previousCategories?: ConsentPreferences,
): void {
  if (globalThis.window === undefined) return

  ensureDataLayer()

  const changedCategories = previousCategories
    ? Object.keys(categories).filter((key) => categories[key] !== previousCategories[key])
    : []

  const event: ConsentUpdatedEvent = {
    event: 'consent_updated',
    consent_version: LIBRARY_VERSION,
    timestamp: new Date().toISOString(),
    origin,
    categories,
    changed_categories: changedCategories,
  }

  globalThis.window.dataLayer?.push(event)
}

/**
 * Hook helper para facilitar uso em componentes React.
 * Retorna funções de disparo de eventos prontas para uso.
 *
 * @returns Objeto com funções de disparo de eventos
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { pushInitialized, pushUpdated } = useDataLayerEvents();
 *
 *   useEffect(() => {
 *     pushInitialized({ necessary: true, analytics: false });
 *   }, []);
 *
 *   const handleAcceptAll = () => {
 *     const newPrefs = { necessary: true, analytics: true, marketing: true };
 *     pushUpdated(newPrefs, 'banner');
 *   };
 * }
 * ```
 *
 * @category Hooks
 * @since 0.4.5
 * @public
 */
export function useDataLayerEvents() {
  return {
    pushInitialized: pushConsentInitializedEvent,
    pushUpdated: pushConsentUpdatedEvent,
  }
}
