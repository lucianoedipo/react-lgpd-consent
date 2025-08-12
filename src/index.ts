/**
 * @module react-lgpd-consent
 * @description
 * Ponto de entrada público da biblioteca react-lgpd-consent.
 * Exporta componentes, hooks, utilitários e tipos para gerenciamento de consentimento de cookies conforme LGPD.
 *
 * - Componentes de UI baseados em Material-UI
 * - Context Provider para estado global de consentimento
 * - Hooks customizados para acesso ao consentimento
 * - Utilitários para manipulação de cookies e scripts
 * - Tipos TypeScript para máxima segurança e clareza
 *
 * @remarks
 * Consulte a documentação oficial para exemplos de uso e integração.
 */

// Componentes
export { CookieBanner } from './components/CookieBanner'
export { PreferencesModal } from './components/PreferencesModal'
export { FloatingPreferencesButton } from './components/FloatingPreferencesButton'

// Contexto + Hooks
export { ConsentProvider } from './context/ConsentContext'
export {
  useConsent,
  useConsentTexts,
  useConsentHydration,
} from './hooks/useConsent'

// Hooks de categorias - novo sistema
export {
  useCategories,
  useCategoryStatus,
  useCustomCategories, // LEGACY compatibility
} from './context/CategoriesContext'

// Utils
export { ConsentGate } from './utils/ConsentGate'
export { loadScript } from './utils/scriptLoader'
export { defaultConsentTheme } from './utils/theme'
export {
  ConsentScriptLoader,
  useConsentScriptLoader,
} from './utils/ConsentScriptLoader'
export {
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createUserWayIntegration,
  COMMON_INTEGRATIONS,
  type ScriptIntegration,
  type GoogleAnalyticsConfig,
  type GoogleTagManagerConfig,
  type UserWayConfig,
} from './utils/scriptIntegrations'

// Tipos
export type {
  Category,
  CategoryDefinition,
  ConsentPreferences,
  ConsentState,
  ConsentTexts,
  ConsentCookieOptions,
  ProjectCategoriesConfig, // Nova configuração de categorias
} from './types/types'

// Utilitários de orientação para developers
export type { DeveloperGuidance } from './utils/developerGuidance'
export {
  DEFAULT_PROJECT_CATEGORIES,
  analyzeDeveloperConfiguration,
} from './utils/developerGuidance'
